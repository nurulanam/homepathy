<?php

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\User;
use App\Services\Workspace\WorkspaceService;

test('approving a payment activates the subscription and records the reviewer', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $admin = User::factory()->admin()->create();

    $payment = Payment::factory()->for($user)->for($workspace)->for($workspace->subscription)->create();

    $response = $this->actingAs($admin)->post(route('admin.payments.approve', $payment));

    $response->assertSessionHasNoErrors();

    $payment->refresh();

    expect($payment->status)->toBe(PaymentStatus::Approved);
    expect($payment->reviewed_by)->toBe($admin->id);
    expect($payment->reviewed_at)->not->toBeNull();
    expect($workspace->subscription->fresh()->status)->toBe(SubscriptionStatus::Active);
});

test('rejecting a payment requires a reason and does not activate the subscription', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $admin = User::factory()->admin()->create();

    $payment = Payment::factory()->for($user)->for($workspace)->for($workspace->subscription)->create();

    $missingReason = $this->actingAs($admin)->post(route('admin.payments.reject', $payment), []);
    $missingReason->assertSessionHasErrors('rejection_reason');

    $response = $this->actingAs($admin)->post(route('admin.payments.reject', $payment), [
        'rejection_reason' => 'লেনদেন আইডি যাচাই করা যায়নি।',
    ]);
    $response->assertSessionHasNoErrors();

    $payment->refresh();

    expect($payment->status)->toBe(PaymentStatus::Rejected);
    expect($payment->rejection_reason)->not->toBeNull();
    expect($workspace->subscription->fresh()->status)->not->toBe(SubscriptionStatus::Active);
});

test('a non admin user cannot access admin payment routes', function () {
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);
    $payment = Payment::factory()->for($user)->for($workspace)->for($workspace->subscription)->create();

    $this->actingAs($user)->get(route('admin.payments.index'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.payments.approve', $payment))->assertForbidden();
});

test('an admin cannot approve their own submitted payment', function () {
    $admin = User::factory()->admin()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($admin);

    $payment = Payment::factory()->for($admin, 'user')->for($workspace)->for($workspace->subscription)->create();

    $this->actingAs($admin)->post(route('admin.payments.approve', $payment))->assertForbidden();

    expect($payment->fresh()->status)->toBe(PaymentStatus::Pending);
});
