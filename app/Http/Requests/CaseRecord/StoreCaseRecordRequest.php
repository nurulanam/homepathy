<?php

namespace App\Http\Requests\CaseRecord;

use App\Models\CaseRecord;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        $workspace = $this->user()?->currentWorkspace;

        return $workspace && $this->user()->can('create', [CaseRecord::class, $workspace]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $workspace = $this->user()->currentWorkspace;

        return [
            'patient_id' => [
                'required',
                Rule::exists('patients', 'id')->where('workspace_id', $workspace->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
