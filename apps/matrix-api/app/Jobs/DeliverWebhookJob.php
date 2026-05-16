<?php

namespace App\Jobs;

use App\Models\WebhookDelivery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class DeliverWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    public function __construct(public int $deliveryId) {}

    public function backoff(): array
    {
        return [30, 60, 120, 300, 600];
    }

    public function handle(): void
    {
        $delivery = WebhookDelivery::with('endpoint')->find($this->deliveryId);
        if (! $delivery || $delivery->status === 'delivered') {
            return;
        }

        $endpoint = $delivery->endpoint;
        $payload = [
            'event' => $delivery->event,
            'data' => $delivery->payload,
            'timestamp' => now()->toIso8601String(),
        ];

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'X-BusyManager-Event' => $delivery->event,
                    'X-BusyManager-Signature' => hash_hmac('sha256', json_encode($payload), $endpoint->secret ?? ''),
                ])
                ->post($endpoint->url, $payload);

            $delivery->update([
                'status_code' => $response->status(),
                'response_body' => substr($response->body(), 0, 2000),
                'status' => $response->successful() ? 'delivered' : 'failed',
                'attempts' => $delivery->attempts + 1,
            ]);

            if (! $response->successful()) {
                $this->fail(new \RuntimeException('Webhook returned '.$response->status()));
            }
        } catch (\Throwable $e) {
            $delivery->update([
                'status' => 'failed',
                'attempts' => $delivery->attempts + 1,
                'response_body' => $e->getMessage(),
                'next_retry_at' => now()->addSeconds($this->backoff()[$delivery->attempts] ?? 600),
            ]);
            throw $e;
        }
    }
}
