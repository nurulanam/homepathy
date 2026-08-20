<?php

namespace App\Http\Middleware;

use App\Models\WorkspaceMember;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'workspace' => $user?->currentWorkspace ? [
                'id' => $user->currentWorkspace->id,
                'type' => $user->currentWorkspace->type->value,
            ] : null,
            'pendingInvitationsCount' => $user
                ? WorkspaceMember::where('user_id', $user->id)->whereNull('joined_at')->count()
                : 0,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'preferences' => $user ? [
                'theme' => $user->theme,
                'accent_color' => $user->accent_color,
                'font_family' => $user->font_family,
            ] : null,
        ];
    }
}
