<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Business;
use App\Models\BusinessSubscription;
use App\Models\Lead;
use App\Models\Module;
use App\Models\ModuleRuntimeSnapshot;
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
        $this->call(ModuleCatalogSeeder::class);

        $agency = Agency::create(['name' => 'AiApps Agency', 'slug' => 'aiapps']);

        $balance = TokenBalance::create(['balance' => 100000]);

        $org = Organization::create([
            'agency_id' => $agency->id,
            'token_balance_id' => $balance->id,
            'name' => 'Karting Alacant',
            'slug' => 'karting-alacant',
            'plan' => 'pro',
        ]);

        User::create([
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

        Business::create([
            'organization_id' => $org->id,
            'name' => 'Karting Alicante',
            'slug' => 'alicante',
            'settings' => [
                'monitor_url' => 'https://httpstat.us/503',
            ],
        ]);

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

        $webUptimeModule = Module::where('slug', 'web-uptime')->firstOrFail();

        $subA = BusinessSubscription::create([
            'business_id' => $businessA->id,
            'module_id' => $webUptimeModule->id,
            'is_active' => true,
            'activated_at' => now(),
        ]);

        app(ModuleAuthService::class)->issueKey($subA);

        ModuleRuntimeSnapshot::create([
            'business_id' => $businessA->id,
            'module_slug' => 'web-uptime',
            'payload' => [
                'url' => 'https://httpstat.us/200',
                'last_check_at' => now()->toIso8601String(),
                'is_up' => true,
                'last_status_code' => 200,
                'uptime_30d_pct' => 100,
                'open_incident' => null,
                'recent_incidents' => [],
                'ssl_ok' => true,
                'ssl_days_remaining' => 90,
                'ssl_expires_at' => now()->addDays(90)->toIso8601String(),
            ],
        ]);

        WebhookEndpoint::create([
            'business_id' => $businessA->id,
            'url' => 'http://localhost:9090/webhook-test',
            'secret' => 'demo-secret',
            'events' => ['*'],
        ]);

        $sources = ['web_form', 'whatsapp', 'manual', 'seo'];
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

        $this->command?->info('Demo API key for web-uptime (business Valencia):');
        $this->command?->info($subA->fresh()->apiKey?->plain_key ?? 'run activate to generate');
    }
}
