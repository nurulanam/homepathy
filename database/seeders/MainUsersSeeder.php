<?php

namespace Database\Seeders;

use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\User;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Database\Seeder;

class MainUsersSeeder extends Seeder
{
    /**
     * Seed the main admin and practitioner accounts.
     */
    public function run(WorkspaceService $workspaces): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Main Admin',
            'email' => 'admin@homepathy.test',
        ]);
        $workspaces->createPersonalWorkspace($admin);

        $practitioner = User::factory()->create([
            'name' => 'Main Practitioner',
            'email' => 'practitioner@homepathy.test',
        ]);
        $workspace = $workspaces->createPersonalWorkspace($practitioner);
        $workspace->subscription->update([
            'plan' => SubscriptionPlan::Practitioner,
            'status' => SubscriptionStatus::Active,
            'starts_at' => now(),
            'ends_at' => now()->addDays(config('subscriptions.subscription_period_days')),
            'trial_ends_at' => null,
        ]);
    }
}
