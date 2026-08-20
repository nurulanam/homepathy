<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\AppearanceUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    /**
     * Show the user's appearance settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/appearance');
    }

    /**
     * Update the user's appearance preferences.
     */
    public function update(AppearanceUpdateRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return back();
    }
}
