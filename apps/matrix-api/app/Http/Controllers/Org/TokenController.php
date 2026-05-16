<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Services\TokenBudgetService;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class TokenController extends Controller
{
    public function show(TokenBudgetService $tokens): JsonResponse
    {
        return response()->json([
            'balance' => $tokens->getBalance(),
            'ledger' => $tokens->ledger(),
        ]);
    }
}
