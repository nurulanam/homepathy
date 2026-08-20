<?php

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionPlan;
use App\Models\Payment;
use App\Models\User;
use App\Services\Workspace\WorkspaceService;

function actingUserWithWorkspace(): array
{
    $user = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($user);

    return [$user, $workspace];
}

test('a valid payment submission is stored as pending with the server-computed amount', function () {
    [$user, $workspace] = actingUserWithWorkspace();

    $response = test()->actingAs($user)->post(route('subscription.payment.store'), [
        'plan' => SubscriptionPlan::Practitioner->value,
        'payment_method' => 'bkash',
        'transaction_id' => 'ABC123XYZ789',
        'sender_mobile' => '01712345678',
        'amount' => 1, // client-sent amount must be ignored entirely
    ]);

    $response->assertSessionHasNoErrors();

    $payment = Payment::where('transaction_id', 'ABC123XYZ789')->firstOrFail();

    expect($payment->status)->toBe(PaymentStatus::Pending);
    expect($payment->amount)->toBe(SubscriptionPlan::Practitioner->price());
    expect($payment->amount)->not->toBe(1);
    expect($payment->workspace_id)->toBe($workspace->id);
});

test('a duplicate transaction id is rejected', function () {
    [$user, $workspace] = actingUserWithWorkspace();

    Payment::factory()->for($user)->for($workspace)->for($workspace->subscription)->create([
        'transaction_id' => 'DUPLICATE001',
    ]);

    $response = test()->actingAs($user)->post(route('subscription.payment.store'), [
        'plan' => SubscriptionPlan::Practitioner->value,
        'payment_method' => 'nagad',
        'transaction_id' => 'DUPLICATE001',
        'sender_mobile' => '01812345678',
    ]);

    $response->assertSessionHasErrors('transaction_id');
    expect(Payment::where('transaction_id', 'DUPLICATE001')->count())->toBe(1);
});

test('an invalid sender mobile format is rejected', function () {
    [$user] = actingUserWithWorkspace();

    $response = test()->actingAs($user)->post(route('subscription.payment.store'), [
        'plan' => SubscriptionPlan::Practitioner->value,
        'payment_method' => 'bkash',
        'transaction_id' => 'VALIDTX001',
        'sender_mobile' => '12345',
    ]);

    $response->assertSessionHasErrors('sender_mobile');
});

test('an unauthenticated request cannot submit a payment', function () {
    $response = test()->post(route('subscription.payment.store'), [
        'plan' => SubscriptionPlan::Practitioner->value,
        'payment_method' => 'bkash',
        'transaction_id' => 'GUESTTX001',
        'sender_mobile' => '01712345678',
    ]);

    $response->assertRedirect(route('login'));
});
