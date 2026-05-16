<?php

namespace App\Support;

use App\Models\Business;
use App\Models\Organization;
use App\Models\User;

class TenantContext
{
    public function __construct(
        public ?User $user = null,
        public ?Organization $organization = null,
        public ?Business $business = null,
        public ?string $moduleSlug = null,
        public ?int $moduleSubscriptionId = null,
    ) {}

    public function organizationId(): ?int
    {
        return $this->organization?->id;
    }

    public function businessId(): ?int
    {
        return $this->business?->id;
    }

    public function isModule(): bool
    {
        return $this->moduleSlug !== null;
    }
}
