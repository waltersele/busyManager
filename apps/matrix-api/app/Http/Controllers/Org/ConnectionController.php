<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\ProviderConnection;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConnectionController extends Controller
{
    public function __construct(private TenantContext $tenant) {}

    public function index(Request $request): JsonResponse
    {
        $businessId = $request->query('business_id');

        $query = ProviderConnection::query()
            ->where('organization_id', $this->tenant->organizationId());

        if ($businessId) {
            $query->where(function ($q) use ($businessId) {
                $q->whereNull('business_id')->orWhere('business_id', $businessId);
            });
        } else {
            $query->whereNull('business_id');
        }

        return response()->json([
            'data' => $query->get()->map(fn ($c) => [
                'id' => $c->id,
                'provider' => $c->provider,
                'scope' => $c->scope,
                'label' => $c->label,
                'business_id' => $c->business_id,
                'is_active' => $c->is_active,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider' => 'required|string',
            'scope' => 'required|in:organization,business',
            'business_id' => 'nullable|exists:businesses,id',
            'credentials' => 'required|array',
            'label' => 'nullable|string',
        ]);

        $businessId = $data['scope'] === 'business' ? $data['business_id'] : null;

        $connection = ProviderConnection::create([
            'organization_id' => $this->tenant->organizationId(),
            'business_id' => $businessId,
            'provider' => $data['provider'],
            'scope' => $data['scope'],
            'credentials' => ProviderConnection::encryptCredentials($data['credentials']),
            'label' => $data['label'] ?? $data['provider'],
        ]);

        return response()->json(['id' => $connection->id, 'provider' => $connection->provider], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $connection = ProviderConnection::query()
            ->where('organization_id', $this->tenant->organizationId())
            ->findOrFail($id);

        $connection->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
