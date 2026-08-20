<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\WorkspaceRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property bool $is_admin
 * @property int|null $current_workspace_id
 * @property string $theme
 * @property string $accent_color
 * @property string $font_family
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'theme', 'accent_color', 'font_family'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * The personal workspace this user owns (created automatically at registration).
     */
    public function ownedWorkspace(): HasOne
    {
        return $this->hasOne(Workspace::class, 'owner_id');
    }

    /**
     * Clinic workspaces this user is a staff member of.
     */
    public function workspaceMemberships(): HasMany
    {
        return $this->hasMany(WorkspaceMember::class);
    }

    public function currentWorkspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'current_workspace_id');
    }

    /**
     * All workspaces this user can act within (owned + clinics they've joined).
     *
     * @return array<int, Workspace>
     */
    public function workspaces(): array
    {
        $owned = $this->ownedWorkspace()->get();
        $memberOf = Workspace::whereIn('id', $this->workspaceMemberships()->pluck('workspace_id'))->get();

        return $owned->merge($memberOf)->unique('id')->values()->all();
    }

    public function roleIn(Workspace $workspace): ?WorkspaceRole
    {
        return $workspace->roleFor($this);
    }
}
