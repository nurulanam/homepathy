<?php

namespace App\Http\Controllers\Subscription;

use App\Enums\PaymentMethod;
use App\Enums\SubscriptionPlan;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\SubmitPaymentRequest;
use App\Models\Payment;
use App\Services\Payment\PaymentService;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $payments,
        private readonly WorkspaceService $workspaces,
    ) {}

    /**
     * Show the payment form for a chosen plan, with the server-computed amount.
     */
    public function create(Request $request, string $plan): Response
    {
        if (! in_array($plan, [SubscriptionPlan::Practitioner->value, SubscriptionPlan::Clinic->value], true)) {
            abort(404);
        }

        $planEnum = SubscriptionPlan::from($plan);
        $workspace = $request->user()->currentWorkspace;

        return Inertia::render('subscription/payment', [
            'plan' => [
                'value' => $planEnum->value,
                'label' => $planEnum->label(),
            ],
            'amount' => $this->workspaces->monthlyPriceFor($workspace, $planEnum),
            'paymentMethods' => collect(PaymentMethod::cases())->map(fn (PaymentMethod $method) => [
                'value' => $method->value,
                'label' => $method->label(),
                'number' => $method->number(),
            ]),
        ]);
    }

    /**
     * Submit a manual bKash/Nagad payment for admin review.
     */
    public function store(SubmitPaymentRequest $request): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace;
        $plan = SubscriptionPlan::from($request->validated('plan'));

        $this->payments->submit($request->user(), $workspace, $plan, [
            'payment_method' => $request->validated('payment_method'),
            'transaction_id' => $request->validated('transaction_id'),
            'sender_mobile' => $request->validated('sender_mobile'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('আপনার পেমেন্ট জমা হয়েছে, যাচাইয়ের অপেক্ষায় আছে।')]);

        return to_route('subscription.payments.history');
    }

    /**
     * Payment history for the current workspace.
     */
    public function history(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        $payments = Payment::where('workspace_id', $workspace->id)
            ->latest('submitted_at')
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'plan' => $payment->plan->value,
                'amount' => $payment->amount,
                'payment_method' => $payment->payment_method->value,
                'transaction_id' => $payment->transaction_id,
                'status' => $payment->status->value,
                'submitted_at' => $payment->submitted_at?->toIso8601String(),
                'reviewed_at' => $payment->reviewed_at?->toIso8601String(),
                'rejection_reason' => $payment->rejection_reason,
            ]);

        return Inertia::render('subscription/payment-history', [
            'payments' => $payments,
        ]);
    }
}
