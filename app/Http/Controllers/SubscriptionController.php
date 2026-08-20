<?php

namespace App\Http\Controllers;

use App\Services\Subscription\EntitlementService;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly EntitlementService $entitlements,
        private readonly WorkspaceService $workspaces,
    ) {}

    /**
     * The subscription dashboard: current plan, status, dates, CTAs.
     */
    public function show(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;
        $subscription = $workspace->subscription;

        return Inertia::render('subscription/dashboard', [
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'type' => $workspace->type->value,
            ],
            'subscription' => [
                'plan' => $subscription->plan->value,
                'plan_label' => $subscription->plan->label(),
                'status' => $subscription->status->value,
                'starts_at' => $subscription->starts_at?->toIso8601String(),
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
            ],
            'isOnTrial' => $this->entitlements->isOnTrial($workspace),
            'trialExpired' => $this->entitlements->trialExpired($workspace),
            'hasActiveSubscription' => $this->entitlements->hasActiveSubscription($workspace),
            'remainingDays' => $this->entitlements->remainingDays($workspace),
            'isOwner' => $workspace->owner_id === $request->user()->id,
        ]);
    }
}
