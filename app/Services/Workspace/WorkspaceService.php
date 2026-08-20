<?php

namespace App\Services\Workspace;

use App\Enums\SubscriptionPlan;
use App\Enums\WorkspaceRole;
use App\Enums\WorkspaceType;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use App\Services\Subscription\SubscriptionService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WorkspaceService
{
    public function __construct(
        private readonly SubscriptionService $subscriptions,
    ) {}

    /**
     * Create the personal workspace and 7-day trial for a newly registered user.
     */
    public function createPersonalWorkspace(User $user): Workspace
    {
        return DB::transaction(function () use ($user) {
            $workspace = Workspace::create([
                'type' => WorkspaceType::Personal,
                'name' => $user->name,
                'owner_id' => $user->id,
            ]);

            WorkspaceMember::create([
                'workspace_id' => $workspace->id,
                'user_id' => $user->id,
                'role' => WorkspaceRole::Owner,
                'joined_at' => now(),
            ]);

            $user->forceFill(['current_workspace_id' => $workspace->id])->save();

            $this->subscriptions->startTrial($workspace);

            return $workspace;
        });
    }

    /**
     * Create a new clinic workspace owned by the given user.
     */
    public function createClinicWorkspace(User $owner, string $name): Workspace
    {
        return DB::transaction(function () use ($owner, $name) {
            $workspace = Workspace::create([
                'type' => WorkspaceType::Clinic,
                'name' => $name,
                'owner_id' => $owner->id,
            ]);

            WorkspaceMember::create([
                'workspace_id' => $workspace->id,
                'user_id' => $owner->id,
                'role' => WorkspaceRole::Owner,
                'joined_at' => now(),
            ]);

            return $workspace;
        });
    }

    /**
     * Invite (or immediately attach, for already-registered users) a member into a clinic workspace.
     */
    public function inviteMember(Workspace $workspace, string $email, WorkspaceRole $role): WorkspaceMember
    {
        if ($workspace->type !== WorkspaceType::Clinic) {
            throw new InvalidArgumentException('Only clinic workspaces can have multiple members.');
        }

        if ($role === WorkspaceRole::Owner) {
            throw new InvalidArgumentException('Cannot invite a member as owner.');
        }

        $invitee = User::where('email', $email)->firstOrFail();

        return WorkspaceMember::firstOrCreate(
            ['workspace_id' => $workspace->id, 'user_id' => $invitee->id],
            ['role' => $role, 'joined_at' => null],
        );
    }

    /**
     * Mark a pending invitation as accepted by the invited user.
     */
    public function acceptInvite(WorkspaceMember $member): WorkspaceMember
    {
        $member->forceFill(['joined_at' => now()])->save();

        return $member;
    }

    public function removeMember(Workspace $workspace, WorkspaceMember $member): void
    {
        if ($member->role === WorkspaceRole::Owner) {
            throw new InvalidArgumentException('The workspace owner cannot be removed.');
        }

        abort_unless($member->workspace_id === $workspace->id, 404);

        $member->delete();
    }

    public function changeRole(Workspace $workspace, WorkspaceMember $member, WorkspaceRole $role): WorkspaceMember
    {
        abort_unless($member->workspace_id === $workspace->id, 404);

        if ($member->role === WorkspaceRole::Owner || $role === WorkspaceRole::Owner) {
            throw new InvalidArgumentException('Ownership cannot be reassigned through role changes.');
        }

        $member->forceFill(['role' => $role])->save();

        return $member;
    }

    /**
     * Number of seats beyond the plan's included allowance, based on current membership.
     */
    public function additionalSeatCount(Workspace $workspace): int
    {
        $plan = $workspace->subscription?->plan ?? SubscriptionPlan::Clinic;
        $memberCount = $workspace->members()->count();

        return max(0, $memberCount - $plan->includedSeats());
    }

    /**
     * The monthly price for a workspace's current membership under the given plan.
     */
    public function monthlyPriceFor(Workspace $workspace, SubscriptionPlan $plan): int
    {
        if ($plan !== SubscriptionPlan::Clinic) {
            return $plan->price();
        }

        $memberCount = max($workspace->members()->count(), $plan->includedSeats());
        $additionalSeats = max(0, $memberCount - $plan->includedSeats());

        return $plan->price() + ($additionalSeats * $plan->extraSeatPrice());
    }
}
