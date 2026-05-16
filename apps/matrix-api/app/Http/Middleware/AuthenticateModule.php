<?php

namespace App\Http\Middleware;

use App\Services\ModuleAuthService;
use App\Support\TenantContext;
use Closure;
use Illuminate\Http\Request;

class AuthenticateModule
{
    public function __construct(
        private ModuleAuthService $moduleAuth,
        private TenantContext $tenant,
    ) {}

    public function handle(Request $request, Closure $next)
    {
        $key = $request->header('X-Module-Key') ?? $request->bearerToken();

        if (! $key) {
            return response()->json(['message' => 'Module API key required'], 401);
        }

        $context = $this->moduleAuth->authenticate($key);
        if (! $context) {
            return response()->json(['message' => 'Invalid module API key'], 401);
        }

        app()->instance(TenantContext::class, $context);

        return $next($request);
    }
}
