<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_runtime_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('module_slug', 64);
            $table->json('payload');
            $table->timestamps();

            $table->unique(['business_id', 'module_slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_runtime_snapshots');
    }
};
