<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\LeadEvent;
use App\Support\TenantContext;

class LeadWorkbenchService
{
    public function __construct(private TenantContext $tenant) {}

    public function create(array $data): Lead
    {
        $lead = Lead::create([
            'organization_id' => $this->tenant->organizationId(),
            'business_id' => $this->tenant->businessId(),
            'source' => $data['source'] ?? 'unknown',
            'status' => $data['status'] ?? 'new',
            'contact_name' => $data['contact_name'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'] ?? null,
            'department' => $data['department'] ?? null,
            'intent' => $data['intent'] ?? null,
            'assigned_user_id' => $data['assigned_user_id'] ?? null,
            'data' => $data['data'] ?? null,
        ]);

        $this->addEvent($lead->id, 'created', ['source' => $lead->source]);

        return $lead;
    }

    public function update(int $id, array $data): Lead
    {
        $lead = $this->findLead($id);
        $lead->update(collect($data)->only([
            'status', 'contact_name', 'contact_email', 'contact_phone',
            'department', 'intent', 'assigned_user_id', 'data',
        ])->filter()->all());

        $this->addEvent($lead->id, 'updated', $data);

        return $lead->fresh();
    }

    public function addEvent(int $leadId, string $type, array $data = []): LeadEvent
    {
        $lead = $this->findLead($leadId);

        return LeadEvent::create([
            'lead_id' => $lead->id,
            'type' => $type,
            'data' => $data,
            'actor_type' => $this->tenant->isModule() ? 'module' : 'user',
            'actor_id' => $this->tenant->user?->id,
        ]);
    }

    public function list(array $filters = []): array
    {
        $query = Lead::query()
            ->where('business_id', $this->tenant->businessId())
            ->with('events')
            ->latest();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return ['data' => $query->limit(50)->get()->toArray()];
    }

    public function findLead(int $id): Lead
    {
        return Lead::query()
            ->where('business_id', $this->tenant->businessId())
            ->where('id', $id)
            ->firstOrFail();
    }
}
