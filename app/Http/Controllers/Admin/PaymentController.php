<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectPaymentRequest;
use App\Models\Payment;
use App\Services\Payment\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    /**
     * List payments for admin review, with filters.
     */
    public function index(Request $request): Response
    {
        $query = Payment::query()->with(['user:id,name,email', 'workspace:id,name']);

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($method = $request->string('payment_method')->toString()) {
            $query->where('payment_method', $method);
        }

        if ($plan = $request->string('plan')->toString()) {
            $query->where('plan', $plan);
        }

        if ($from = $request->string('from')->toString()) {
            $query->whereDate('submitted_at', '>=', $from);
        }

        if ($to = $request->string('to')->toString()) {
            $query->whereDate('submitted_at', '<=', $to);
        }

        $payments = $query->latest('submitted_at')->get()->map(fn (Payment $payment) => [
            'id' => $payment->id,
            'user' => ['name' => $payment->user->name, 'email' => $payment->user->email],
            'workspace' => $payment->workspace->name,
            'plan' => $payment->plan->value,
            'amount' => $payment->amount,
            'payment_method' => $payment->payment_method->value,
            'transaction_id' => $payment->transaction_id,
            'sender_mobile' => $payment->sender_mobile,
            'status' => $payment->status->value,
            'submitted_at' => $payment->submitted_at?->toIso8601String(),
            'reviewed_at' => $payment->reviewed_at?->toIso8601String(),
        ]);

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'payment_method', 'plan', 'from', 'to']),
        ]);
    }

    public function approve(Request $request, Payment $payment): RedirectResponse
    {
        abort_unless($request->user()->can('review', $payment), 403);

        $this->payments->approve($payment, $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('পেমেন্ট অনুমোদিত হয়েছে।')]);

        return back();
    }

    public function reject(RejectPaymentRequest $request, Payment $payment): RedirectResponse
    {
        $this->payments->reject($payment, $request->user(), $request->validated('rejection_reason'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('পেমেন্ট প্রত্যাখ্যান করা হয়েছে।')]);

        return back();
    }
}
