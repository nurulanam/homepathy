<?php

namespace App\Services\Payment;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionPlan;
use App\Models\Payment;
use App\Models\User;
use App\Models\Workspace;
use App\Notifications\PaymentApproved;
use App\Notifications\PaymentRejected;
use App\Notifications\PaymentSubmitted;
use App\Services\Subscription\SubscriptionService;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class PaymentService
{
    public function __construct(
        private readonly WorkspaceService $workspaces,
        private readonly SubscriptionService $subscriptions,
    ) {}

    /**
     * Submit a manual bKash/Nagad payment for review. The amount is always
     * computed server-side from the plan configuration and live seat count
     * — the client cannot influence what is charged.
     *
     * @param  array{payment_method: string, transaction_id: string, sender_mobile: string}  $data
     */
    public function submit(User $user, Workspace $workspace, SubscriptionPlan $plan, array $data): Payment
    {
        return DB::transaction(function () use ($user, $workspace, $plan, $data) {
            if (Payment::where('transaction_id', $data['transaction_id'])->lockForUpdate()->exists()) {
                throw ValidationException::withMessages([
                    'transaction_id' => 'এই লেনদেন আইডি ইতিমধ্যে ব্যবহৃত হয়েছে।',
                ]);
            }

            $subscription = $workspace->subscription()->lockForUpdate()->firstOrFail();

            $amount = $this->workspaces->monthlyPriceFor($workspace, $plan);

            $payment = Payment::create([
                'user_id' => $user->id,
                'workspace_id' => $workspace->id,
                'subscription_id' => $subscription->id,
                'plan' => $plan,
                'payment_method' => $data['payment_method'],
                'amount' => $amount,
                'transaction_id' => $data['transaction_id'],
                'sender_mobile' => $data['sender_mobile'],
                'status' => PaymentStatus::Pending,
                'submitted_at' => now(),
            ]);

            foreach (User::where('is_admin', true)->get() as $admin) {
                $admin->notify(new PaymentSubmitted($payment));
            }

            return $payment;
        });
    }

    public function approve(Payment $payment, User $admin): Payment
    {
        if ($payment->user_id === $admin->id) {
            throw new RuntimeException('An admin cannot approve their own payment.');
        }

        return DB::transaction(function () use ($payment, $admin) {
            $payment = Payment::where('id', $payment->id)->lockForUpdate()->firstOrFail();

            if ($payment->status !== PaymentStatus::Pending) {
                throw new RuntimeException('Only pending payments can be approved.');
            }

            $payment->update([
                'status' => PaymentStatus::Approved,
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
            ]);

            $this->subscriptions->activateFromPayment($payment);

            $payment->user->notify(new PaymentApproved($payment));

            return $payment->fresh();
        });
    }

    public function reject(Payment $payment, User $admin, string $reason): Payment
    {
        if ($payment->user_id === $admin->id) {
            throw new RuntimeException('An admin cannot reject their own payment.');
        }

        return DB::transaction(function () use ($payment, $admin, $reason) {
            $payment = Payment::where('id', $payment->id)->lockForUpdate()->firstOrFail();

            if ($payment->status !== PaymentStatus::Pending) {
                throw new RuntimeException('Only pending payments can be rejected.');
            }

            $payment->update([
                'status' => PaymentStatus::Rejected,
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'rejection_reason' => $reason,
            ]);

            $payment->user->notify(new PaymentRejected($payment));

            return $payment->fresh();
        });
    }
}
