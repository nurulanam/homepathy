<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\SubscriptionPlan;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'workspace_id' => Workspace::factory(),
            'subscription_id' => Subscription::factory(),
            'plan' => SubscriptionPlan::Practitioner,
            'payment_method' => PaymentMethod::Bkash,
            'amount' => SubscriptionPlan::Practitioner->price(),
            'transaction_id' => strtoupper(fake()->unique()->bothify('TX##??##??##')),
            'sender_mobile' => '01'.fake()->numberBetween(3, 9).fake()->numerify('########'),
            'status' => PaymentStatus::Pending,
            'submitted_at' => now(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PaymentStatus::Approved,
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PaymentStatus::Rejected,
            'reviewed_at' => now(),
            'rejection_reason' => 'Invalid transaction reference.',
        ]);
    }
}
