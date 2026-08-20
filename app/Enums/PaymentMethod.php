<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Bkash = 'bkash';
    case Nagad = 'nagad';

    public function label(): string
    {
        return config("subscriptions.payment_methods.{$this->value}.label");
    }

    public function number(): ?string
    {
        return config("subscriptions.payment_methods.{$this->value}.number");
    }
}
