<?php

use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\CaseRecord;
use App\Models\Patient;
use App\Models\User;
use App\Services\Subscription\EntitlementService;
use App\Services\Subscription\SubscriptionService;
use App\Services\Workspace\WorkspaceService;

test('registration creates a personal workspace and starts a 7 day trial', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Dr. Rahim',
        'email' => 'rahim@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasNoErrors();

    $user = User::where('email', 'rahim@example.com')->firstOrFail();

    expect($user->ownedWorkspace)->not->toBeNull();

    $subscription = $user->ownedWorkspace->subscription;

    expect($subscription->plan)->toBe(SubscriptionPlan::Trial);
    expect($subscription->status)->toBe(SubscriptionStatus::Trial);
    expect($subscription->trial_ends_at->diffInDays(now()))->toBeLessThanOrEqual(7);
});

test('a workspace within its trial window has full access', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);

    $entitlements = app(EntitlementService::class);

    expect($entitlements->isOnTrial($workspace))->toBeTrue();
    expect($entitlements->trialExpired($workspace))->toBeFalse();
    expect($entitlements->canCreateCase($workspace))->toBeTrue();
    expect($entitlements->canCreatePatient($workspace))->toBeTrue();
});

test('trial expires after 7 days and blocks premium actions but keeps read access', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);

    $workspace->subscription->update([
        'trial_ends_at' => now()->subDay(),
        'ends_at' => now()->subDay(),
    ]);
    $workspace->refresh();

    $entitlements = app(EntitlementService::class);

    expect($entitlements->trialExpired($workspace))->toBeTrue();
    expect($entitlements->hasFullAccess($workspace))->toBeFalse();
    expect($entitlements->canCreateCase($workspace))->toBeFalse();
    expect($entitlements->canCreatePatient($workspace))->toBeFalse();

    // Existing data remains visible (read-only) — creating models directly and
    // checking policy access, since "read" is never gated by entitlements.
    $patient = Patient::factory()->for($workspace)->create(['created_by' => $user->id]);
    CaseRecord::factory()->for($workspace)->for($patient)->create(['created_by' => $user->id]);

    expect($user->can('view', $patient))->toBeTrue();
});

test('the daily expiration sweep flips overdue trials to expired', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);

    $workspace->subscription->update(['trial_ends_at' => now()->subDay(), 'ends_at' => now()->subDay()]);

    app(SubscriptionService::class)->expireOverdue();

    expect($workspace->subscription->fresh()->status)->toBe(SubscriptionStatus::Expired);
});
