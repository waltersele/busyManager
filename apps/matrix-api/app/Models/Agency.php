<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    protected $fillable = ['name', 'slug'];

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}
