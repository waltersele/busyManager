<?php

namespace App\Services;

use App\Mail\AlertMail;
use App\Models\Alert;
use App\Support\TenantContext;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    public function __construct(private TenantContext $tenant) {}

    public function notify(string $channel, string $title, string $body, string $severity = 'info', array $meta = []): Alert
    {
        $alert = Alert::create([
            'organization_id' => $this->tenant->organizationId(),
            'business_id' => $this->tenant->businessId(),
            'channel' => $channel,
            'severity' => $severity,
            'title' => $title,
            'body' => $body,
            'meta' => $meta,
        ]);

        if (in_array($channel, ['email', 'alert_center'], true)) {
            $this->sendEmail($title, $body, $severity);
        }

        if ($channel === 'whatsapp') {
            Log::info('WhatsApp notify stub', ['title' => $title, 'business_id' => $this->tenant->businessId()]);
        }

        return $alert;
    }

    private function sendEmail(string $title, string $body, string $severity): void
    {
        $org = $this->tenant->organization;
        $recipients = $org->members()->pluck('email')->filter()->all();

        if (empty($recipients)) {
            return;
        }

        foreach ($recipients as $email) {
            try {
                Mail::to($email)->send(new AlertMail($title, $body, $severity));
            } catch (\Throwable $e) {
                Log::warning('Mail send failed', ['error' => $e->getMessage()]);
            }
        }
    }
}
