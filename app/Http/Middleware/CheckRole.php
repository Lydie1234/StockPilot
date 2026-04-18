<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                abort(401);
            }

            return redirect()->guest(route('login'));
        }

        if ($role !== null && Auth::user()->role !== $role) {
            abort(403);
        }

        return $next($request);
    }
}


