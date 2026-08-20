<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trial length
    |--------------------------------------------------------------------------
    */
    'trial_days' => (int) env('TRIAL_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | Plans
    |--------------------------------------------------------------------------
    |
    | The single source of truth for plan pricing and seat allowances.
    | Never hardcode a price anywhere else in the app.
    |
    */
    'plans' => [
        'trial' => [
            'label' => 'ফ্রি ট্রায়াল',
            'price' => 0,
            'included_seats' => 1,
        ],
        'practitioner' => [
            'label' => 'Practitioner',
            'price' => (int) env('PRACTITIONER_PLAN_PRICE', 299),
            'included_seats' => 1,
        ],
        'clinic' => [
            'label' => 'Clinic',
            'price' => (int) env('CLINIC_PLAN_PRICE', 699),
            'included_seats' => 3,
            'extra_seat_price' => (int) env('CLINIC_EXTRA_SEAT_PRICE', 150),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Manual payment methods
    |--------------------------------------------------------------------------
    |
    | The merchant numbers shown to users on the payment page. Configurable
    | via env so an admin can change them without touching any code.
    |
    */
    'payment_methods' => [
        'bkash' => [
            'label' => 'bKash',
            'number' => env('BKASH_MERCHANT_NUMBER'),
        ],
        'nagad' => [
            'label' => 'Nagad',
            'number' => env('NAGAD_MERCHANT_NUMBER'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Renewal / reminder windows
    |--------------------------------------------------------------------------
    */
    'expiring_soon_days' => (int) env('SUBSCRIPTION_EXPIRING_SOON_DAYS', 3),

    /*
    |--------------------------------------------------------------------------
    | Subscription length
    |--------------------------------------------------------------------------
    |
    | Paid plans run for a fixed number of days from activation/renewal,
    | not calendar months.
    |
    */
    'subscription_period_days' => (int) env('SUBSCRIPTION_PERIOD_DAYS', 30),

];
