<?php

namespace App\Http\Controllers;

use App\Http\Requests\Patient\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        $patients = $workspace->patients()
            ->withCount('caseRecords')
            ->latest()
            ->get()
            ->map(fn (Patient $patient) => [
                'id' => $patient->id,
                'name' => $patient->name,
                'phone' => $patient->phone,
                'case_records_count' => $patient->case_records_count,
                'created_at' => $patient->created_at->toIso8601String(),
            ]);

        return Inertia::render('patients/index', [
            'patients' => $patients,
            'canCreate' => $request->user()->can('create', [Patient::class, $workspace]),
        ]);
    }

    public function create(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        abort_unless($request->user()->can('create', [Patient::class, $workspace]), 403);

        return Inertia::render('patients/create');
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $request->user()->currentWorkspace->patients()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('রোগী যুক্ত করা হয়েছে।')]);

        return to_route('patients.index');
    }
}
