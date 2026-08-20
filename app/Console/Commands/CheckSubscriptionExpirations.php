<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Notifications\SubscriptionExpired;
use App\Notifications\SubscriptionExpiringSoon;
use App\Notifications\TrialEndingSoon;
use App\Notifications\TrialExpired;
use App\Services\Subscription\SubscriptionService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:check-subscription-expirations')]
#[Description('Send trial/subscription expiry reminders and expire overdue subscriptions')]
class CheckSubscriptionExpirations extends Command
{
    public function __construct(private readonly SubscriptionService $subscriptions)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $warningDays = config('subscriptions.expiring_soon_days');
        $warningWindow = now()->addDays($warningDays);

        Subscription::query()
            ->where('status', SubscriptionStatus::Trial)
            ->whereNotNull('trial_ends_at')
            ->whereBetween('trial_ends_at', [now(), $warningWindow])
            ->with('workspace.owner')
            ->get()
            ->each(function (Subscription $subscription) {
                $subscription->workspace->owner->notify(
                    new TrialEndingSoon($subscription->workspace, (int) ceil(now()->floatDiffInDays($subscription->trial_ends_at)))
                );
            });

        Subscription::query()
            ->where('status', SubscriptionStatus::Active)
            ->whereNotNull('ends_at')
            ->whereBetween('ends_at', [now(), $warningWindow])
            ->with('workspace.owner')
            ->get()
            ->each(function (Subscription $subscription) {
                $subscription->workspace->owner->notify(
                    new SubscriptionExpiringSoon($subscription->workspace, (int) ceil(now()->floatDiffInDays($subscription->ends_at)))
                );
            });

        $justExpiredTrials = Subscription::query()
            ->where('status', SubscriptionStatus::Trial)
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<', now())
            ->with('workspace.owner')
            ->get();

        $justExpiredPaid = Subscription::query()
            ->where('status', SubscriptionStatus::Active)
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->with('workspace.owner')
            ->get();

        $expiredCount = $this->subscriptions->expireOverdue();

        $justExpiredTrials->each(fn (Subscription $subscription) => $subscription->workspace->owner->notify(
            new TrialExpired($subscription->workspace)
        ));

        $justExpiredPaid->each(fn (Subscription $subscription) => $subscription->workspace->owner->notify(
            new SubscriptionExpired($subscription->workspace)
        ));

        $this->info("Expired {$expiredCount} subscription(s).");
    }
}
