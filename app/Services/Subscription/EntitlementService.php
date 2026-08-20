<?php

namespace App\Services\Subscription;

use App\Enums\SubscriptionPlan;
use App\Models\Workspace;

/**
 * The single source of truth for what a workspace is entitled to do.
 * Controllers, policies, and middleware should all go through here rather
 * than inlining plan/trial checks of their own.
 */
class EntitlementService
{
    /**
     * Features that are blocked once a workspace's access has lapsed
     * (trial expired, or paid subscription expired/cancelled with no
     * active replacement). Read-only access is always preserved.
     */
    private const array MUTATING_FEATURES = [
        'create_patient',
        'create_case',
        'invite_member',
        'ai_assist',
        'export_pdf',
    ];

    public function isOnTrial(Workspace $workspace): bool
    {
        $subscription = $workspace->subscription;

        return $subscription
            && $subscription->plan === SubscriptionPlan::Trial
            && $subscription->trial_ends_at?->isFuture();
    }

    public function trialExpired(Workspace $workspace): bool
    {
        $subscription = $workspace->subscription;

        return $subscription
            && $subscription->plan === SubscriptionPlan::Trial
            && ! $subscription->trial_ends_at?->isFuture();
    }

    public function hasActiveSubscription(Workspace $workspace): bool
    {
        $subscription = $workspace->subscription;

        return $subscription
            && $subscription->plan !== SubscriptionPlan::Trial
            && $subscription->ends_at?->isFuture();
    }

    /**
     * Whether the workspace currently has full (non-read-only) access,
     * whether via an active trial or a paid subscription in good standing.
     */
    public function hasFullAccess(Workspace $workspace): bool
    {
        return $this->isOnTrial($workspace) || $this->hasActiveSubscription($workspace);
    }

    public function currentPlan(Workspace $workspace): ?SubscriptionPlan
    {
        return $workspace->subscription?->plan;
    }

    /**
     * Days remaining in the trial or the current paid period, never negative.
     */
    public function remainingDays(Workspace $workspace): int
    {
        $endsAt = $workspace->subscription?->ends_at;

        if (! $endsAt || $endsAt->isPast()) {
            return 0;
        }

        return (int) ceil(now()->floatDiffInDays($endsAt));
    }

    public function canUse(Workspace $workspace, string $feature): bool
    {
        if (! in_array($feature, self::MUTATING_FEATURES, true)) {
            return true;
        }

        return $this->hasFullAccess($workspace);
    }

    public function canCreatePatient(Workspace $workspace): bool
    {
        return $this->canUse($workspace, 'create_patient');
    }

    public function canCreateCase(Workspace $workspace): bool
    {
        return $this->canUse($workspace, 'create_case');
    }

    public function canInviteMember(Workspace $workspace): bool
    {
        return $workspace->subscription?->plan === SubscriptionPlan::Clinic
            && $this->canUse($workspace, 'invite_member');
    }
}
