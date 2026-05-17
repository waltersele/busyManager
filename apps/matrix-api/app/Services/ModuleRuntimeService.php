<?php

namespace App\Services;

use App\Models\Business;
use App\Models\ModuleRuntimeSnapshot;

class ModuleRuntimeService
{
    public function publish(Business $business, string $moduleSlug, array $payload): ModuleRuntimeSnapshot
    {
        return ModuleRuntimeSnapshot::updateOrCreate(
            [
                'business_id' => $business->id,
                'module_slug' => $moduleSlug,
            ],
            ['payload' => $payload],
        );
    }

    public function get(Business $business, string $moduleSlug): ?array
    {
        $row = ModuleRuntimeSnapshot::query()
            ->where('business_id', $business->id)
            ->where('module_slug', $moduleSlug)
            ->first();

        return $row?->payload;
    }
}
