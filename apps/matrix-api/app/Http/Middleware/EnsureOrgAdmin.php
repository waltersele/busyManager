<?php

namespace App\Http\Middleware;

use App\Support\TenantContext;
use Closure;
use Illuminate\Http\Request;

class EnsureOrgAdmin
{
    public function __construct(private TenantContext $tenant) {}

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user?->is_superadmin) {
            return $next($request);
        }

        $member = $user?->organizations()
            ->where('organizations.id', $this->tenant->organizationId())
            ->first();

        if ($member && in_array($member->pivot->role, ['org_admin'], true)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden'], 403);
    }
}
