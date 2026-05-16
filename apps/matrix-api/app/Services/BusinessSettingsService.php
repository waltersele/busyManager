<?php

namespace App\Services;

use App\Models\Business;

class BusinessSettingsService
{
    public const DEFAULTS = [
        'identity' => [
            'trade_name' => '',
            'legal_name' => '',
            'logo_url' => '',
        ],
        'web' => [
            'url' => '',
            'language' => 'es',
        ],
        'fiscal' => [
            'tax_id' => '',
            'address' => '',
            'city' => '',
            'postal_code' => '',
            'country' => 'ES',
        ],
        'contact' => [
            'phone' => '',
            'public_email' => '',
        ],
    ];

    public function get(Business $business): array
    {
        $stored = $business->settings ?? [];

        return array_replace_recursive(self::DEFAULTS, $stored);
    }

    public function update(Business $business, array $input): array
    {
        $current = $this->get($business);
        $merged = array_replace_recursive($current, $input);
        $business->update(['settings' => $merged]);

        return $merged;
    }
}
