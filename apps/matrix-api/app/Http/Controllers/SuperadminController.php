<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;

class SuperadminController extends Controller
{
    public function organizations(): JsonResponse
    {
        return response()->json([
            'data' => Organization::with('agency', 'businesses')->get(),
        ]);
    }

    public function auditLog(): JsonResponse
    {
        return response()->json([
            'data' => AuditLog::latest()->limit(100)->get(),
        ]);
    }
}
