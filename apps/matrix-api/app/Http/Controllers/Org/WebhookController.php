<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\WebhookEndpoint;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    public function __construct(private TenantContext $tenant) {}

    public function index(): JsonResponse
    {
        $endpoints = WebhookEndpoint::query()
            ->where('business_id', $this->tenant->businessId())
            ->get();

        return response()->json(['data' => $endpoints]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => 'required|url',
            'events' => 'nullable|array',
        ]);

        $endpoint = WebhookEndpoint::create([
            'business_id' => $this->tenant->businessId(),
            'url' => $data['url'],
            'secret' => Str::random(32),
            'events' => $data['events'] ?? ['*'],
        ]);

        return response()->json($endpoint, 201);
    }

    public function destroy(int $id): JsonResponse
    {
        WebhookEndpoint::query()
            ->where('business_id', $this->tenant->businessId())
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
