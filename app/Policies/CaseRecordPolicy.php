<?php

namespace App\Policies;

use App\Models\CaseRecord;
use App\Models\User;
use App\Models\Workspace;

class CaseRecordPolicy
{
    public function view(User $user, CaseRecord $caseRecord): bool
    {
        return $caseRecord->workspace->roleFor($user) !== null;
    }

    public function create(User $user, Workspace $workspace): bool
    {
        return $workspace->roleFor($user)?->canManageCases() ?? false;
    }

    public function update(User $user, CaseRecord $caseRecord): bool
    {
        return $caseRecord->workspace->roleFor($user)?->canManageCases() ?? false;
    }
}
