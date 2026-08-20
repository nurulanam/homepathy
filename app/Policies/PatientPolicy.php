<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use App\Models\Workspace;

class PatientPolicy
{
    public function view(User $user, Patient $patient): bool
    {
        return $patient->workspace->roleFor($user) !== null;
    }

    public function create(User $user, Workspace $workspace): bool
    {
        return $workspace->roleFor($user)?->canManagePatients() ?? false;
    }

    public function update(User $user, Patient $patient): bool
    {
        return $patient->workspace->roleFor($user)?->canManagePatients() ?? false;
    }
}
