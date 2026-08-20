<?php

namespace Database\Factories;

use App\Enums\WorkspaceType;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Workspace>
 */
class WorkspaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => WorkspaceType::Personal,
            'name' => fake()->company(),
            'owner_id' => User::factory(),
        ];
    }

    public function clinic(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => WorkspaceType::Clinic,
        ]);
    }
}
