<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Business;
use App\Models\BusinessSubscription;
use App\Models\Lead;
use App\Models\Module;
use App\Models\Organization;
use App\Models\ProviderConnection;
use App\Models\TokenBalance;
use App\Models\User;
use App\Models\WebhookEndpoint;
use App\Services\ModuleAuthService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $agency = Agency::create(['name' => 'AiApps Agency', 'slug' => 'aiapps']);

        $balance = TokenBalance::create(['balance' => 100000]);

        $org = Organization::create([
            'agency_id' => $agency->id,
            'token_balance_id' => $balance->id,
            'name' => 'Karting Alacant',
            'slug' => 'karting-alacant',
            'plan' => 'pro',
        ]);

        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@busymanager.local',
            'password' => Hash::make('password'),
            'is_superadmin' => true,
        ]);

        $orgAdmin = User::create([
            'name' => 'Org Admin',
            'email' => 'orgadmin@karting.demo',
            'password' => Hash::make('password'),
        ]);

        $org->members()->attach($orgAdmin->id, ['role' => 'org_admin']);

        $businessA = Business::create([
            'organization_id' => $org->id,
            'name' => 'Karting Valencia',
            'slug' => 'valencia',
            'settings' => [
                'identity' => ['trade_name' => 'Karting Valencia'],
                'web' => ['url' => 'https://httpstat.us/200', 'language' => 'es'],
                'fiscal' => ['tax_id' => 'B12345678', 'city' => 'Valencia', 'country' => 'ES'],
                'contact' => ['phone' => '+34 600 000 001', 'public_email' => 'info@karting-valencia.demo'],
                'monitor_url' => 'https://httpstat.us/200',
            ],
        ]);

        $businessB = Business::create([
            'organization_id' => $org->id,
            'name' => 'Karting Alicante',
            'slug' => 'alicante',
            'settings' => [
                'monitor_url' => 'https://httpstat.us/503',
            ],
        ]);

        $modules = [
            ['slug' => 'lead-router', 'name' => 'Lead Router', 'category' => 'captacion'],
            ['slug' => 'form-builder', 'name' => 'Form Builder', 'category' => 'captacion'],
            ['slug' => 'form-detector', 'name' => 'Form Detector', 'category' => 'captacion'],
            ['slug' => 'whatsapp-guardia', 'name' => 'WhatsApp Guardia', 'category' => 'social'],
            ['slug' => 'resenas-gmb', 'name' => 'Reseñas GMB', 'category' => 'social'],
            ['slug' => 'reputacion-multicanal', 'name' => 'Reputación multicanal', 'category' => 'social'],
            ['slug' => 'monitor-menciones', 'name' => 'Monitor de menciones', 'category' => 'social'],
            ['slug' => 'seo-onpage', 'name' => 'SEO on-page', 'category' => 'contenido'],
            ['slug' => 'seo-pipeline', 'name' => 'SEO Pipeline', 'category' => 'contenido'],
            ['slug' => 'enlaces-rotos', 'name' => 'Detector enlaces rotos', 'category' => 'contenido'],
            ['slug' => 'alerta-posicion-seo', 'name' => 'Alerta posición SEO', 'category' => 'contenido'],
            ['slug' => 'voz-gestion', 'name' => 'Voz a gestión', 'category' => 'gestion'],
            ['slug' => 'presupuestos-wa', 'name' => 'Presupuestos WA', 'category' => 'gestion', 'is_available' => false],
            ['slug' => 'seguimiento-automatico', 'name' => 'Seguimiento automático', 'category' => 'gestion'],
            ['slug' => 'asignacion-zona', 'name' => 'Asignación por zona', 'category' => 'gestion'],
            ['slug' => 'web-uptime', 'name' => 'Web caída', 'category' => 'monitorizacion'],
            ['slug' => 'monitor-ssl', 'name' => 'Monitor SSL', 'category' => 'monitorizacion'],
            ['slug' => 'velocidad-carga', 'name' => 'Velocidad de carga', 'category' => 'monitorizacion'],
            ['slug' => 'caida-trafico', 'name' => 'Caída de tráfico', 'category' => 'monitorizacion'],
            ['slug' => 'digital-signage', 'name' => 'Digital signage', 'category' => 'visual', 'is_available' => false],
            ['slug' => 'video-local', 'name' => 'Video en local', 'category' => 'visual', 'is_available' => false],
            ['slug' => 'menu-dinamico', 'name' => 'Menú dinámico', 'category' => 'visual', 'is_available' => false],
        ];

        foreach ($modules as $m) {
            Module::create([
                'slug' => $m['slug'],
                'name' => $m['name'],
                'category' => $m['category'],
                'is_available' => $m['is_available'] ?? true,
            ]);
        }

        ProviderConnection::create([
            'organization_id' => $org->id,
            'business_id' => null,
            'provider' => 'gemini',
            'scope' => 'organization',
            'credentials' => ProviderConnection::encryptCredentials(['api_key' => 'demo-gemini-key']),
            'label' => 'Google Gemini',
        ]);

        ProviderConnection::create([
            'organization_id' => $org->id,
            'business_id' => null,
            'provider' => 'email',
            'scope' => 'organization',
            'credentials' => ProviderConnection::encryptCredentials(['from' => 'alerts@karting.demo']),
            'label' => 'Email',
        ]);

        $webUptimeModule = Module::where('slug', 'web-uptime')->first();

        $subA = BusinessSubscription::create([
            'business_id' => $businessA->id,
            'module_id' => $webUptimeModule->id,
            'is_active' => true,
            'activated_at' => now(),
        ]);

        app(ModuleAuthService::class)->issueKey($subA);

        WebhookEndpoint::create([
            'business_id' => $businessA->id,
            'url' => 'http://localhost:9090/webhook-test',
            'secret' => 'demo-secret',
            'events' => ['*'],
        ]);

        $sources = ['web_form', 'whatsapp', 'lead-router', 'manual', 'seo'];
        foreach ($sources as $i => $source) {
            $lead = Lead::create([
                'organization_id' => $org->id,
                'business_id' => $businessA->id,
                'source' => $source,
                'status' => ['new', 'contacted', 'qualified'][$i % 3],
                'contact_name' => 'Lead Demo '.($i + 1),
                'contact_email' => 'lead'.($i + 1).'@demo.com',
                'intent' => 'info',
            ]);
            $lead->events()->create(['type' => 'created', 'data' => ['seed' => true]]);
        }

        $this->call(ModulePricingSeeder::class);

        $this->command?->info('Demo API key for web-uptime (business Valencia):');
        $this->command?->info($subA->fresh()->apiKey?->plain_key ?? 'run activate to generate');
    }
}
