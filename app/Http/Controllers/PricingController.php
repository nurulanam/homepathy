<?php

namespace App\Http\Controllers;

use App\Enums\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    /**
     * Show the three available plans.
     */
    public function __invoke(Request $request): Response
    {
        $plans = collect(SubscriptionPlan::cases())->map(fn (SubscriptionPlan $plan) => [
            'value' => $plan->value,
            'label' => $plan->label(),
            'price' => $plan->price(),
            'included_seats' => $plan->includedSeats(),
            'extra_seat_price' => $plan->extraSeatPrice(),
        ]);

        return Inertia::render('pricing', [
            'plans' => $plans,
        ]);
    }
}
