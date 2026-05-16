<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderConnection extends Model
{
    protected $fillable = [
        'organization_id', 'business_id', 'provider', 'scope',
        'credentials', 'label', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function getDecryptedCredentials(): array
    {
        $raw = decrypt($this->credentials);

        return json_decode($raw, true) ?: [];
    }

    public static function encryptCredentials(array $data): string
    {
        return encrypt(json_encode($data));
    }
}
