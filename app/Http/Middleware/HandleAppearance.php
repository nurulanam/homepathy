<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        View::share('appearance', $user?->theme ?? $request->cookie('appearance') ?? 'system');
        View::share('accentColor', $user?->accent_color ?? $request->cookie('accent_color') ?? 'teal');
        View::share('fontFamily', $user?->font_family ?? $request->cookie('font_family') ?? 'instrument');

        return $next($request);
    }
}
