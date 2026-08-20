<?php

namespace App\Policies;

use App\Enums\WorkspaceRole;
use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    /**
     * Any workspace member (any role) can view the workspace.
     */
    public function view(User $user, Workspace $workspace): bool
    {
        return $workspace->roleFor($user) !== null;
    }

    /**
     * Only the owner manages members, billing, and workspace settings.
     */
    public function manage(User $user, Workspace $workspace): bool
    {
        return $workspace->roleFor($user) === WorkspaceRole::Owner;
    }

    public function inviteMember(User $user, Workspace $workspace): bool
    {
        return $this->manage($user, $workspace);
    }

    public function manageBilling(User $user, Workspace $workspace): bool
    {
        return $this->manage($user, $workspace);
    }
}
