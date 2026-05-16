<?php

namespace App\Http\Middleware;

use App\Models\Business;
use App\Support\TenantContext;
use Closure;
use Illuminate\Http\Request;

class ResolveBusinessContext
{
    public function __construct(private TenantContext $tenant) {}

    public function handle(Request $request, Closure $next)
    {
        if ($this->tenant->isModule()) {
            return $next($request);
        }

        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $businessId = $request->header('X-Business-Id') ?? $request->route('business');

        if ($businessId instanceof Business) {
            $businessId = $businessId->id;
        }

        if (! $businessId && $this->tenant->organization) {
            $business = $this->tenant->organization->businesses()->first();
            if ($business) {
                app()->instance(TenantContext::class, new TenantContext(
                    user: $user,
                    organization: $this->tenant->organization,
                    business: $business,
                ));
            }

            return $next($request);
        }

        if ($businessId) {
            $business = Business::find($businessId);
            if ($business && $business->organization_id === $this->tenant->organizationId()) {
                app()->instance(TenantContext::class, new TenantContext(
                    user: $user,
                    organization: $this->tenant->organization,
                    business: $business,
                ));
            }
        }

        return $next($request);
    }
}
