<?php

use App\Http\Controllers\CaseRecordController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('patients', [PatientController::class, 'index'])->name('patients.index');
    Route::get('patients/create', [PatientController::class, 'create'])->name('patients.create');
    Route::post('patients', [PatientController::class, 'store'])->name('patients.store');

    Route::get('cases', [CaseRecordController::class, 'index'])->name('cases.index');
    Route::get('cases/create', [CaseRecordController::class, 'create'])->name('cases.create');
    Route::post('cases', [CaseRecordController::class, 'store'])->name('cases.store');
});
