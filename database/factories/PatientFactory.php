<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
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
            'created_by' => User::factory(),
            'name' => fake()->name(),
            'phone' => '01'.fake()->numberBetween(3, 9).fake()->numerify('########'),
        ];
    }
}
