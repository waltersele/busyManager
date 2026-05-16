<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Services\BusinessSettingsService;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessSettingsController extends Controller
{
    public function __construct(
        private TenantContext $tenant,
        private BusinessSettingsService $settings,
    ) {}

    public function show(Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        return response()->json([
            'business_id' => $business->id,
            'name' => $business->name,
            'timezone' => $business->timezone,
            'settings' => $this->settings->get($business),
        ]);
    }

    public function update(Request $request, Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string|max:64',
            'settings' => 'sometimes|array',
            'settings.identity' => 'sometimes|array',
            'settings.web' => 'sometimes|array',
            'settings.fiscal' => 'sometimes|array',
            'settings.contact' => 'sometimes|array',
        ]);

        if (isset($data['name'])) {
            $business->update(['name' => $data['name']]);
        }
        if (isset($data['timezone'])) {
            $business->update(['timezone' => $data['timezone']]);
        }
        if (isset($data['settings'])) {
            $this->settings->update($business, $data['settings']);
        }

        return response()->json([
            'business_id' => $business->id,
            'name' => $business->fresh()->name,
            'timezone' => $business->fresh()->timezone,
            'settings' => $this->settings->get($business->fresh()),
        ]);
    }

    private function authorizeBusiness(Business $business): void
    {
        if ($business->organization_id !== $this->tenant->organizationId()) {
            abort(404);
        }
    }
}
