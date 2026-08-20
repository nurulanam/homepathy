<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppearanceUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'theme' => ['sometimes', Rule::in(['light', 'dark', 'system'])],
            'accent_color' => ['sometimes', Rule::in(['teal', 'blue', 'purple', 'orange', 'rose'])],
            'font_family' => ['sometimes', Rule::in(['instrument', 'inter', 'lora', 'jetbrains-mono'])],
        ];
    }
}
