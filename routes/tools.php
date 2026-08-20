<?php

use Illuminate\Support\Facades\Route;

$tools = [
    'repertory' => ['title' => 'Repertory', 'description' => 'Rubric-based remedy search.'],
    'materia-medica' => ['title' => 'Materia Medica', 'description' => 'Remedy reference library.'],
    'miasm' => ['title' => 'Miasm Analysis', 'description' => 'Psora, sycosis, and syphilis analysis.'],
    'temperament' => ['title' => 'Temperament', 'description' => 'Constitutional typing.'],
    'acute-cases' => ['title' => 'Acute Cases', 'description' => 'Rapid-onset prescribing.'],
    'organon' => ['title' => 'Organon', 'description' => 'Aphorism reference.'],
    'anatomy' => ['title' => 'Anatomy', 'description' => 'Rubric-linked anatomy reference.'],
];

Route::middleware(['auth'])->group(function () use ($tools) {
    foreach ($tools as $slug => $meta) {
        Route::inertia("tools/{$slug}", 'tools/coming-soon', $meta)->name("tools.{$slug}");
    }
});
