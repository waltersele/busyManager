<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Support\TenantContext;
use Closure;
use Illuminate\Http\Request;

class SetUserTenant
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (! $user) {
            return $next($request);
        }

        $orgId = $request->header('X-Organization-Id');
        $org = $orgId
            ? Organization::find($orgId)
            : $user->organizations()->first();

        if ($org) {
            app()->instance(TenantContext::class, new TenantContext(
                user: $user,
                organization: $org,
            ));
        }

        return $next($request);
    }
}
