<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * @deprecated Usar ModuleCatalogSeeder como fuente única de precios y copy.
 */
class ModulePricingSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ModuleCatalogSeeder::class);
    }
}
