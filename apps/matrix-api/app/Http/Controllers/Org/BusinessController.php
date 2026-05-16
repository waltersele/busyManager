<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Business;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    public function __construct(private TenantContext $tenant) {}

    public function index(): JsonResponse
    {
        $businesses = $this->tenant->organization->businesses()->get();

        return response()->json(['data' => $businesses]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:100',
            'timezone' => 'nullable|string',
            'settings' => 'nullable|array',
        ]);

        $slug = $data['slug'] ?? Str::slug($data['name']);

        $business = Business::create([
            'organization_id' => $this->tenant->organizationId(),
            'name' => $data['name'],
            'slug' => $slug,
            'timezone' => $data['timezone'] ?? 'Europe/Madrid',
            'settings' => $data['settings'] ?? null,
        ]);

        AuditLog::create([
            'organization_id' => $this->tenant->organizationId(),
            'user_id' => $this->tenant->user?->id,
            'action' => 'business.created',
            'meta' => ['business_id' => $business->id],
        ]);

        return response()->json($business, 201);
    }

    public function show(Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        return response()->json($business);
    }

    public function update(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string',
            'settings' => 'sometimes|array',
        ]);

        $business->update($data);

        return response()->json($business->fresh());
    }

    private function authorizeBusiness(Business $business): void
    {
        if ($business->organization_id !== $this->tenant->organizationId()) {
            abort(404);
        }
    }
}
