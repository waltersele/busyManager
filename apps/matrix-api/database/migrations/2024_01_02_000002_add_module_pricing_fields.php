<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->boolean('is_free')->default(false)->after('is_available');
            $table->unsignedInteger('price_monthly_cents')->default(0)->after('is_free');
            $table->text('marketing_description')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['is_free', 'price_monthly_cents', 'marketing_description']);
        });
    }
};
