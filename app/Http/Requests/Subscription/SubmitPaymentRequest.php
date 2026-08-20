<?php

namespace App\Http\Requests\Subscription;

use App\Enums\PaymentMethod;
use App\Enums\SubscriptionPlan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class SubmitPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Note: the payment amount is intentionally never accepted from the
     * client — it is always derived server-side from plan configuration.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan' => ['required', Rule::in([SubscriptionPlan::Practitioner->value, SubscriptionPlan::Clinic->value])],
            'payment_method' => ['required', new Enum(PaymentMethod::class)],
            'transaction_id' => ['required', 'string', 'min:6', 'max:50', 'alpha_num'],
            'sender_mobile' => ['required', 'string', 'regex:/^01[3-9][0-9]{8}$/'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'sender_mobile.regex' => 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)।',
            'transaction_id.alpha_num' => 'লেনদেন আইডি শুধুমাত্র অক্ষর ও সংখ্যা দিয়ে গঠিত হতে হবে।',
        ];
    }
}
