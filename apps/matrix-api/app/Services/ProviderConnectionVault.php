<?php

namespace App\Services;

use App\Models\ProviderConnection;
use App\Support\TenantContext;
use Illuminate\Support\Collection;

class ProviderConnectionVault
{
    public function __construct(private TenantContext $tenant) {}

    public function get(string $provider): ?array
    {
        $connection = $this->findConnection($provider);

        if (! $connection || ! $connection->is_active) {
            return null;
        }

        return [
            'provider' => $connection->provider,
            'scope' => $connection->scope,
            'credentials' => $connection->getDecryptedCredentials(),
        ];
    }

    public function list(): Collection
    {
        $orgId = $this->tenant->organizationId();
        $businessId = $this->tenant->businessId();

        $orgConnections = ProviderConnection::query()
            ->where('organization_id', $orgId)
            ->whereNull('business_id')
            ->where('is_active', true)
            ->get();

        $businessConnections = collect();
        if ($businessId) {
            $businessConnections = ProviderConnection::query()
                ->where('organization_id', $orgId)
                ->where('business_id', $businessId)
                ->where('is_active', true)
                ->get();
        }

        $merged = $orgConnections->keyBy('provider')
            ->merge($businessConnections->keyBy('provider'));

        return $merged->map(fn (ProviderConnection $c) => [
            'provider' => $c->provider,
            'scope' => $c->scope,
            'label' => $c->label,
            'inherited' => $c->business_id === null,
        ])->values();
    }

    private function findConnection(string $provider): ?ProviderConnection
    {
        $orgId = $this->tenant->organizationId();
        $businessId = $this->tenant->businessId();

        if ($businessId) {
            $business = ProviderConnection::query()
                ->where('organization_id', $orgId)
                ->where('business_id', $businessId)
                ->where('provider', $provider)
                ->first();
            if ($business) {
                return $business;
            }
        }

        return ProviderConnection::query()
            ->where('organization_id', $orgId)
            ->whereNull('business_id')
            ->where('provider', $provider)
            ->first();
    }
}
