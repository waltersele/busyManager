<?php

namespace App\Services;

use App\Models\BusinessSubscription;
use App\Models\ModuleApiKey;
use App\Support\TenantContext;
use Illuminate\Support\Facades\Hash;

class ModuleAuthService
{
    public function authenticate(string $apiKey): ?TenantContext
    {
        $hash = hash('sha256', $apiKey);

        $keyRecord = ModuleApiKey::query()
            ->where('key_hash', $hash)
            ->with(['subscription.module', 'subscription.business.organization'])
            ->first();

        if (! $keyRecord || ! $keyRecord->subscription->is_active) {
            return null;
        }

        $sub = $keyRecord->subscription;
        if (! $sub->module->is_available) {
            return null;
        }

        $keyRecord->update(['last_used_at' => now()]);

        $business = $sub->business;

        return new TenantContext(
            organization: $business->organization,
            business: $business,
            moduleSlug: $sub->module->slug,
            moduleSubscriptionId: $sub->id,
        );
    }

    public function issueKey(BusinessSubscription $subscription): string
    {
        $generated = ModuleApiKey::generate();

        ModuleApiKey::updateOrCreate(
            ['business_subscription_id' => $subscription->id],
            [
                'key_hash' => $generated['hash'],
                'key_prefix' => $generated['prefix'],
                'plain_key' => $generated['plain'],
            ]
        );

        return $generated['plain'];
    }

    public function checkSubscription(TenantContext $tenant, string $slug): bool
    {
        if ($tenant->moduleSlug !== $slug) {
            return BusinessSubscription::query()
                ->where('business_id', $tenant->businessId())
                ->whereHas('module', fn ($q) => $q->where('slug', $slug))
                ->where('is_active', true)
                ->exists();
        }

        return true;
    }
}
