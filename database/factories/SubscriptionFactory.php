<?php

namespace Database\Factories;

use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workspace_id' => Workspace::factory(),
            'plan' => SubscriptionPlan::Trial,
            'status' => SubscriptionStatus::Trial,
            'starts_at' => now(),
            'ends_at' => now()->addDays(7),
            'trial_ends_at' => now()->addDays(7),
        ];
    }

    public function active(SubscriptionPlan $plan = SubscriptionPlan::Practitioner): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => $plan,
            'status' => SubscriptionStatus::Active,
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
            'trial_ends_at' => null,
        ]);
    }

    public function expiredTrial(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => SubscriptionPlan::Trial,
            'status' => SubscriptionStatus::Expired,
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->subDays(3),
            'trial_ends_at' => now()->subDays(3),
        ]);
    }

    public function expired(SubscriptionPlan $plan = SubscriptionPlan::Practitioner): static
    {
        return $this->state(fn (array $attributes) => [
            'plan' => $plan,
            'status' => SubscriptionStatus::Expired,
            'starts_at' => now()->subDays(40),
            'ends_at' => now()->subDays(10),
            'trial_ends_at' => null,
        ]);
    }
}
