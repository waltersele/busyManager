<?php

namespace App\Http\Controllers;

use App\Services\LeadWorkbenchService;
use App\Services\ModuleAuthService;
use App\Services\NotificationService;
use App\Services\ProviderConnectionVault;
use App\Services\TokenBudgetService;
use App\Services\WebhookDispatcher;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class MatrixController extends Controller
{
    public function __construct(
        private TenantContext $tenant,
        private ModuleAuthService $moduleAuth,
    ) {}

    public function authCheck(): JsonResponse
    {
        return response()->json([
            'organization_id' => $this->tenant->organizationId(),
            'business_id' => $this->tenant->businessId(),
            'module_slug' => $this->tenant->moduleSlug,
            'settings' => $this->tenant->business
                ? array_merge(
                    app(\App\Services\BusinessSettingsService::class)->get($this->tenant->business),
                    array_filter([
                        'monitor_url' => $this->tenant->business->getSetting('monitor_url'),
                    ]),
                )
                : [],
        ]);
    }

    public function subscriptionCheck(Request $request, string $slug): JsonResponse
    {
        $allowed = $this->moduleAuth->checkSubscription($this->tenant, $slug);

        if (! $allowed) {
            return response()->json(['active' => false, 'message' => 'Module not subscribed'], 403);
        }

        return response()->json(['active' => true, 'slug' => $slug]);
    }

    public function connectionGet(string $provider, ProviderConnectionVault $vault): JsonResponse
    {
        $conn = $vault->get($provider);
        if (! $conn) {
            return response()->json(['message' => 'Connection not found'], 404);
        }

        return response()->json($conn);
    }

    public function connectionsList(ProviderConnectionVault $vault): JsonResponse
    {
        return response()->json(['connections' => $vault->list()]);
    }

    public function tokensCheck(Request $request, TokenBudgetService $tokens): JsonResponse
    {
        $amount = (int) $request->input('amount', 0);
        if (! $tokens->check($amount)) {
            return response()->json(['sufficient' => false], 402);
        }

        return response()->json(['sufficient' => true, 'balance' => $tokens->getBalance()]);
    }

    public function tokensConsume(Request $request, TokenBudgetService $tokens): JsonResponse
    {
        $data = $request->validate([
            'amount' => 'required|integer|min:1',
            'module' => 'required|string',
            'reference' => 'nullable|string',
        ]);

        try {
            $tokens->consume($data['amount'], $data['module'], $data['reference'] ?? null);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 402);
        }

        return response()->json(['balance' => $tokens->getBalance()]);
    }

    public function leadsCreate(Request $request, LeadWorkbenchService $leads): JsonResponse
    {
        $lead = $leads->create($request->all());

        return response()->json($lead, 201);
    }

    public function leadsUpdate(Request $request, int $id, LeadWorkbenchService $leads): JsonResponse
    {
        $lead = $leads->update($id, $request->all());

        return response()->json($lead);
    }

    public function leadsEvent(Request $request, int $id, LeadWorkbenchService $leads): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $event = $leads->addEvent($id, $data['type'], $data['data'] ?? []);

        return response()->json($event, 201);
    }

    public function webhooksEmit(Request $request, WebhookDispatcher $dispatcher): JsonResponse
    {
        $data = $request->validate([
            'event' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $count = $dispatcher->emit($data['event'], $data['data'] ?? []);

        return response()->json(['dispatched' => $count]);
    }

    public function notify(Request $request, NotificationService $notify): JsonResponse
    {
        $data = $request->validate([
            'channel' => 'required|string',
            'title' => 'required|string',
            'body' => 'required|string',
            'severity' => 'nullable|string',
            'meta' => 'nullable|array',
        ]);

        $alert = $notify->notify(
            $data['channel'],
            $data['title'],
            $data['body'],
            $data['severity'] ?? 'info',
            $data['meta'] ?? [],
        );

        return response()->json($alert, 201);
    }
}
