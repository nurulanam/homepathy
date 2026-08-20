<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentSubmitted extends Notification
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_submitted',
            'payment_id' => $this->payment->id,
            'plan' => $this->payment->plan->value,
            'amount' => $this->payment->amount,
            'message' => 'একটি নতুন পেমেন্ট যাচাইয়ের জন্য অপেক্ষা করছে।',
        ];
    }
}
