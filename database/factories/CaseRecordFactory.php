<?php

namespace Database\Factories;

use App\Models\CaseRecord;
use App\Models\Patient;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CaseRecord>
 */
class CaseRecordFactory extends Factory
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
            'patient_id' => Patient::factory(),
            'created_by' => User::factory(),
            'title' => fake()->sentence(3),
        ];
    }
}
