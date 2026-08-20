<?php

namespace App\Http\Middleware;

use App\Services\Subscription\EntitlementService;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionActive
{
    public function __construct(private readonly EntitlementService $entitlements) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $workspace = $request->user()?->currentWorkspace;

        if (! $workspace || ! $this->entitlements->hasFullAccess($workspace)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে। চালিয়ে যেতে সাবস্ক্রাইব করুন।'),
            ]);

            return redirect()->route('subscription.show');
        }

        return $next($request);
    }
}
