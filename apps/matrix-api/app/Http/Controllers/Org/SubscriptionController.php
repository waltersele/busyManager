<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessSubscription;
use App\Models\Module;
use App\Services\ModuleAuthService;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        private TenantContext $tenant,
        private ModuleAuthService $moduleAuth,
    ) {}

    public function catalog(): JsonResponse
    {
        return response()->json(['data' => Module::orderBy('category')->get()]);
    }

    public function appsSidebar(Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        $activeMap = $business->subscriptions()
            ->where('is_active', true)
            ->with('module')
            ->get()
            ->keyBy(fn ($s) => $s->module->slug);

        $modules = Module::orderBy('category')->orderBy('name')->get();

        $categories = [];
        foreach ($modules as $module) {
            $cat = $module->category;
            if (! isset($categories[$cat])) {
                $categories[$cat] = [];
            }
            $sub = $activeMap->get($module->slug);
            $categories[$cat][] = $this->formatApp($module, $sub);
        }

        $categoryOrder = ['captacion', 'social', 'contenido', 'gestion', 'monitorizacion', 'visual'];
        $ordered = [];
        foreach ($categoryOrder as $key) {
            if (isset($categories[$key])) {
                $ordered[] = [
                    'id' => $key,
                    'apps' => $categories[$key],
                ];
            }
        }

        return response()->json([
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
            ],
            'categories' => $ordered,
        ]);
    }

    public function showApp(Business $business, string $moduleSlug): JsonResponse
    {
        $this->authorizeBusiness($business);

        $module = Module::where('slug', $moduleSlug)->firstOrFail();
        $sub = $business->subscriptions()
            ->whereHas('module', fn ($q) => $q->where('slug', $moduleSlug))
            ->where('is_active', true)
            ->first();

        return response()->json($this->formatApp($module, $sub));
    }

    public function index(Business $business): JsonResponse
    {
        $this->authorizeBusiness($business);

        $subs = $business->subscriptions()->with('module', 'apiKey')->get()->map(fn ($s) => [
            'id' => $s->id,
            'module' => $s->module,
            'is_active' => $s->is_active,
            'api_key_prefix' => $s->apiKey?->key_prefix,
            'has_api_key' => $s->apiKey !== null,
        ]);

        return response()->json(['data' => $subs]);
    }

    public function activate(Request $request, Business $business, string $moduleSlug): JsonResponse
    {
        $this->authorizeBusiness($business);

        $module = Module::where('slug', $moduleSlug)->firstOrFail();

        $sub = BusinessSubscription::updateOrCreate(
            ['business_id' => $business->id, 'module_id' => $module->id],
            ['is_active' => true, 'activated_at' => now()],
        );

        $apiKey = $this->moduleAuth->issueKey($sub);

        return response()->json([
            'subscription_id' => $sub->id,
            'module_slug' => $module->slug,
            'api_key' => $apiKey,
        ]);
    }

    public function deactivate(Business $business, string $moduleSlug): JsonResponse
    {
        $this->authorizeBusiness($business);

        $module = Module::where('slug', $moduleSlug)->firstOrFail();

        BusinessSubscription::query()
            ->where('business_id', $business->id)
            ->where('module_id', $module->id)
            ->update(['is_active' => false]);

        return response()->json(['message' => 'Deactivated']);
    }

    private function formatApp(Module $module, ?BusinessSubscription $sub): array
    {
        return [
            'slug' => $module->slug,
            'name' => $module->name,
            'category' => $module->category,
            'description' => $module->description,
            'marketing_description' => $module->marketing_description,
            'is_available' => $module->is_available,
            'is_free' => (bool) ($module->is_free ?? false),
            'price_monthly_cents' => (int) ($module->price_monthly_cents ?? 0),
            'price_label' => method_exists($module, 'priceFormatted')
                ? $module->priceFormatted()
                : ((($module->is_free ?? false) ? 'Gratis' : 'De pago')),
            'status' => ! $module->is_available
                ? 'coming_soon'
                : ($sub ? 'active' : 'inactive'),
            'activated_at' => $sub?->activated_at,
        ];
    }

    private function authorizeBusiness(Business $business): void
    {
        if ($business->organization_id !== $this->tenant->organizationId()) {
            abort(404);
        }
    }
}
