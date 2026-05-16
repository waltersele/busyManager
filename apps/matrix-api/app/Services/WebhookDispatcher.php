<?php

namespace App\Services;

use App\Jobs\DeliverWebhookJob;
use App\Models\WebhookDelivery;
use App\Models\WebhookEndpoint;
use App\Support\TenantContext;

class WebhookDispatcher
{
    public function __construct(private TenantContext $tenant) {}

    public function emit(string $event, array $data): int
    {
        $businessId = $this->tenant->businessId();
        $endpoints = WebhookEndpoint::query()
            ->where('business_id', $businessId)
            ->where('is_active', true)
            ->get();

        $count = 0;
        foreach ($endpoints as $endpoint) {
            $events = $endpoint->events ?? ['*'];
            if (! in_array('*', $events, true) && ! in_array($event, $events, true)) {
                continue;
            }

            $delivery = WebhookDelivery::create([
                'webhook_endpoint_id' => $endpoint->id,
                'event' => $event,
                'payload' => $data,
                'status' => 'pending',
                'attempts' => 0,
            ]);

            DeliverWebhookJob::dispatch($delivery->id);
            $count++;
        }

        return $count;
    }
}
