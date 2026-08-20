<?php

namespace App\Http\Controllers;

use App\Http\Requests\CaseRecord\StoreCaseRecordRequest;
use App\Models\CaseRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CaseRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        $cases = $workspace->caseRecords()
            ->with('patient:id,name')
            ->latest()
            ->get()
            ->map(fn (CaseRecord $case) => [
                'id' => $case->id,
                'title' => $case->title,
                'notes' => $case->notes,
                'patient' => $case->patient->name,
                'created_at' => $case->created_at->toIso8601String(),
            ]);

        return Inertia::render('cases/index', [
            'cases' => $cases,
            'canCreate' => $request->user()->can('create', [CaseRecord::class, $workspace]),
        ]);
    }

    public function create(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        abort_unless($request->user()->can('create', [CaseRecord::class, $workspace]), 403);

        return Inertia::render('cases/create', [
            'patients' => $workspace->patients()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCaseRecordRequest $request): RedirectResponse
    {
        $request->user()->currentWorkspace->caseRecords()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('কেস যুক্ত করা হয়েছে।')]);

        return to_route('cases.index');
    }
}
