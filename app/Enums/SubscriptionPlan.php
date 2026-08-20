<?php

namespace App\Enums;

enum SubscriptionPlan: string
{
    case Trial = 'trial';
    case Practitioner = 'practitioner';
    case Clinic = 'clinic';

    public function label(): string
    {
        return config("subscriptions.plans.{$this->value}.label");
    }

    public function price(): int
    {
        return config("subscriptions.plans.{$this->value}.price");
    }

    public function includedSeats(): int
    {
        return config("subscriptions.plans.{$this->value}.included_seats");
    }

    public function extraSeatPrice(): int
    {
        return config("subscriptions.plans.{$this->value}.extra_seat_price", 0);
    }
}
