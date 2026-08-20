<?php

namespace App\Services\Subscription;

use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    /**
     * Start the 7-day free trial for a newly created workspace.
     */
    public function startTrial(Workspace $workspace): Subscription
    {
        $trialEndsAt = now()->addDays(config('subscriptions.trial_days'));

        return Subscription::create([
            'workspace_id' => $workspace->id,
            'plan' => SubscriptionPlan::Trial,
            'status' => SubscriptionStatus::Trial,
            'starts_at' => now(),
            'ends_at' => $trialEndsAt,
            'trial_ends_at' => $trialEndsAt,
        ]);
    }

    /**
     * Activate (or renew) a subscription from an approved payment.
     *
     * Paid periods run for a fixed number of days, never calendar months.
     * Renewing before expiry extends from the current end date; renewing
     * after expiry (or from trial) starts fresh from the approval date.
     */
    public function activateFromPayment(Payment $payment): Subscription
    {
        return DB::transaction(function () use ($payment) {
            $subscription = Subscription::where('id', $payment->subscription_id)->lockForUpdate()->firstOrFail();

            $periodDays = config('subscriptions.subscription_period_days');
            $now = now();

            $isContinuingActivePeriod = $subscription->status === SubscriptionStatus::Active
                && $subscription->ends_at !== null
                && $subscription->ends_at->isFuture();

            $baseline = $isContinuingActivePeriod ? $subscription->ends_at : $now;

            $subscription->update([
                'plan' => $payment->plan,
                'status' => SubscriptionStatus::Active,
                'starts_at' => $isContinuingActivePeriod ? $subscription->starts_at : $now,
                'ends_at' => Carbon::parse($baseline)->addDays($periodDays),
                'cancelled_at' => null,
            ]);

            return $subscription->fresh();
        });
    }

    /**
     * Flip any trial/active subscriptions that have passed their end date to expired.
     *
     * @return int number of subscriptions transitioned
     */
    public function expireOverdue(): int
    {
        return Subscription::whereIn('status', [SubscriptionStatus::Trial, SubscriptionStatus::Active])
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->update(['status' => SubscriptionStatus::Expired]);
    }
}
