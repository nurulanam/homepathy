<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->is_admin || $payment->user_id === $user->id;
    }

    /**
     * Admins may review any payment except one they submitted themselves.
     */
    public function review(User $user, Payment $payment): bool
    {
        return $user->is_admin && $payment->user_id !== $user->id;
    }
}
