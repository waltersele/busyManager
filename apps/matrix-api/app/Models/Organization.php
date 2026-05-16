<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = ['agency_id', 'token_balance_id', 'name', 'slug', 'plan'];

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function tokenBalance(): BelongsTo
    {
        return $this->belongsTo(TokenBalance::class);
    }

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function providerConnections(): HasMany
    {
        return $this->hasMany(ProviderConnection::class);
    }
}
