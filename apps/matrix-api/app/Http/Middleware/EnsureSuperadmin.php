<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSuperadmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->is_superadmin) {
            return response()->json(['message' => 'Superadmin required'], 403);
        }

        return $next($request);
    }
}
