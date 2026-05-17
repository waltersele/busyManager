<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = [
        'slug', 'name', 'category', 'description', 'marketing_description',
        'is_available', 'catalog_visible', 'is_free', 'price_monthly_cents',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'catalog_visible' => 'boolean',
            'is_free' => 'boolean',
        ];
    }

    public function priceFormatted(): string
    {
        if ($this->is_free) {
            return 'Gratis';
        }
        $euros = $this->price_monthly_cents / 100;

        return number_format($euros, 2, ',', '.').' €/mes';
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(BusinessSubscription::class);
    }
}
