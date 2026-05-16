<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenLedger extends Model
{
    public $table = 'token_ledger';

    protected $fillable = [
        'token_balance_id', 'organization_id', 'business_id',
        'module_slug', 'amount', 'type', 'reference', 'meta',
    ];

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }

    public function tokenBalance(): BelongsTo
    {
        return $this->belongsTo(TokenBalance::class);
    }
}
