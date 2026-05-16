<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TokenBalance extends Model
{
    protected $fillable = ['balance'];

    public function ledger(): HasMany
    {
        return $this->hasMany(TokenLedger::class);
    }
}
