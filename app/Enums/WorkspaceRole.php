<?php

namespace App\Enums;

enum WorkspaceRole: string
{
    case Owner = 'owner';
    case Practitioner = 'practitioner';
    case Assistant = 'assistant';
    case Receptionist = 'receptionist';

    public function canManageBilling(): bool
    {
        return $this === self::Owner;
    }

    public function canManageMembers(): bool
    {
        return $this === self::Owner;
    }

    public function canAccessClinicalTools(): bool
    {
        return in_array($this, [self::Owner, self::Practitioner, self::Assistant], true);
    }

    public function canManagePatients(): bool
    {
        return in_array($this, [self::Owner, self::Practitioner, self::Assistant, self::Receptionist], true);
    }

    public function canManageCases(): bool
    {
        return in_array($this, [self::Owner, self::Practitioner, self::Assistant], true);
    }
}
