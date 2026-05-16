<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\LeadWorkbenchService;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function __construct(private TenantContext $tenant) {}

    public function index(LeadWorkbenchService $leads): JsonResponse
    {
        return response()->json($leads->list());
    }

    public function show(int $id): JsonResponse
    {
        $lead = Lead::query()
            ->where('business_id', $this->tenant->businessId())
            ->with('events')
            ->findOrFail($id);

        return response()->json($lead);
    }

    public function store(Request $request, LeadWorkbenchService $leads): JsonResponse
    {
        $lead = $leads->create($request->all());

        return response()->json($lead, 201);
    }

    public function update(Request $request, int $id, LeadWorkbenchService $leads): JsonResponse
    {
        $lead = $leads->update($id, $request->all());

        return response()->json($lead);
    }
}
