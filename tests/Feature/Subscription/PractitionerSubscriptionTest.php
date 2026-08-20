<?php

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\User;
use App\Models\Workspace;
use App\Services\Payment\PaymentService;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Support\Carbon;

function makePractitionerPayment(Workspace $workspace, User $user, array $overrides = []): Payment
{
    return Payment::factory()->for($user)->for($workspace)->for($workspace->subscription)->create(array_merge([
        'plan' => SubscriptionPlan::Practitioner,
        'amount' => SubscriptionPlan::Practitioner->price(),
        'status' => PaymentStatus::Pending,
    ], $overrides));
}

test('the practitioner plan price comes from config, never hardcoded', function () {
    config(['subscriptions.plans.practitioner.price' => 349]);

    expect(SubscriptionPlan::Practitioner->price())->toBe(349);
});

test('approving a payment activates a subscription for exactly 30 days', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $admin = User::factory()->admin()->create();

    $payment = makePractitionerPayment($workspace, $user);

    app(PaymentService::class)->approve($payment, $admin);

    $subscription = $workspace->subscription->fresh();

    expect($subscription->status)->toBe(SubscriptionStatus::Active);
    expect($subscription->plan)->toBe(SubscriptionPlan::Practitioner);
    expect((int) $subscription->starts_at->diffInDays($subscription->ends_at))->toBe(30);
});

test('renewing before expiry extends 30 days from the current end date, not from today', function () {
    Carbon::setTestNow('2026-08-20 10:00:00');

    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $admin = User::factory()->admin()->create();

    $firstPayment = makePractitionerPayment($workspace, $user, ['transaction_id' => 'FIRSTTX123']);
    app(PaymentService::class)->approve($firstPayment, $admin);

    $originalEndsAt = $workspace->subscription->fresh()->ends_at;
    expect($originalEndsAt->toDateString())->toBe('2026-09-19');

    // Renew a few days before expiry — still within the active period.
    Carbon::setTestNow('2026-09-10 10:00:00');

    $renewalPayment = makePractitionerPayment($workspace, $user, ['transaction_id' => 'RENEWTX456']);
    app(PaymentService::class)->approve($renewalPayment, $admin);

    $newEndsAt = $workspace->subscription->fresh()->ends_at;

    expect($newEndsAt->toDateString())->toBe('2026-10-19');

    Carbon::setTestNow();
});

test('renewing after expiry starts a fresh 30 days from the approval date', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $admin = User::factory()->admin()->create();

    $workspace->subscription->update([
        'plan' => SubscriptionPlan::Practitioner,
        'status' => SubscriptionStatus::Expired,
        'ends_at' => now()->subDays(10),
    ]);

    Carbon::setTestNow('2026-09-01 09:00:00');

    $payment = makePractitionerPayment($workspace, $user);
    app(PaymentService::class)->approve($payment, $admin);

    $subscription = $workspace->subscription->fresh();

    expect($subscription->status)->toBe(SubscriptionStatus::Active);
    expect($subscription->ends_at->toDateString())->toBe('2026-10-01');

    Carbon::setTestNow();
});
