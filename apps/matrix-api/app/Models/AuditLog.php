<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = ['organization_id', 'business_id', 'user_id', 'action', 'meta'];

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }
}
