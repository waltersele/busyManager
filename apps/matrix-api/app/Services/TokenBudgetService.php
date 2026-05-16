<?php

namespace App\Services;

use App\Models\TokenBalance;
use App\Models\TokenLedger;
use App\Support\TenantContext;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TokenBudgetService
{
    public function __construct(private TenantContext $tenant) {}

    public function check(int $amount): bool
    {
        $balance = $this->getBalance();

        return $balance >= $amount;
    }

    public function consume(int $amount, string $moduleSlug, ?string $reference = null, array $meta = []): void
    {
        if ($amount <= 0) {
            return;
        }

        if (! $this->check($amount)) {
            throw new RuntimeException('Insufficient token balance', 402);
        }

        $org = $this->tenant->organization;
        $balance = $org->tokenBalance;

        DB::transaction(function () use ($amount, $moduleSlug, $reference, $meta, $org, $balance) {
            TokenBalance::where('id', $balance->id)
                ->where('balance', '>=', $amount)
                ->decrement('balance', $amount);

            TokenLedger::create([
                'token_balance_id' => $balance->id,
                'organization_id' => $org->id,
                'business_id' => $this->tenant->businessId(),
                'module_slug' => $moduleSlug,
                'amount' => -$amount,
                'type' => 'consume',
                'reference' => $reference,
                'meta' => $meta,
            ]);
        });
    }

    public function getBalance(): int
    {
        return (int) $this->tenant->organization->tokenBalance->fresh()->balance;
    }

    public function ledger(int $limit = 50): array
    {
        return TokenLedger::query()
            ->where('organization_id', $this->tenant->organizationId())
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
