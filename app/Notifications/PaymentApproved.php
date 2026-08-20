<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentApproved extends Notification
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
            'type' => 'payment_approved',
            'payment_id' => $this->payment->id,
            'plan' => $this->payment->plan->value,
            'message' => 'আপনার পেমেন্ট অনুমোদিত হয়েছে। সাবস্ক্রিপশন সক্রিয় করা হয়েছে।',
        ];
    }
}
