<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MatrixController;
use App\Http\Controllers\Org\BusinessController;
use App\Http\Controllers\Org\BusinessSettingsController;
use App\Http\Controllers\Org\ConnectionController;
use App\Http\Controllers\Org\LeadController;
use App\Http\Controllers\Org\SubscriptionController;
use App\Http\Controllers\Org\TokenController;
use App\Http\Controllers\Org\UserController;
use App\Http\Controllers\Org\WebhookController;
use App\Http\Controllers\SuperadminController;
use App\Http\Middleware\SetUserTenant;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', SetUserTenant::class])->group(function () {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::middleware('superadmin')->prefix('superadmin')->group(function () {
            Route::get('organizations', [SuperadminController::class, 'organizations']);
            Route::get('audit-log', [SuperadminController::class, 'auditLog']);
        });

        Route::middleware(['org.admin', 'business.context'])->prefix('org')->group(function () {
            Route::get('businesses', [BusinessController::class, 'index']);
            Route::post('businesses', [BusinessController::class, 'store']);
            Route::get('businesses/{business}', [BusinessController::class, 'show']);
            Route::patch('businesses/{business}', [BusinessController::class, 'update']);

            Route::get('connections', [ConnectionController::class, 'index']);
            Route::post('connections', [ConnectionController::class, 'store']);
            Route::delete('connections/{id}', [ConnectionController::class, 'destroy']);

            Route::get('modules', [SubscriptionController::class, 'catalog']);
            Route::get('tokens', [TokenController::class, 'show']);

            Route::get('users', [UserController::class, 'index']);
            Route::post('users', [UserController::class, 'store']);
            Route::post('users/business-role', [UserController::class, 'assignBusinessRole']);
        });

        Route::middleware(['org.admin', 'business.context'])->prefix('businesses/{business}')->group(function () {
            Route::get('apps-sidebar', [SubscriptionController::class, 'appsSidebar']);
            Route::get('apps/{moduleSlug}', [SubscriptionController::class, 'showApp']);
            Route::get('settings', [BusinessSettingsController::class, 'show']);
            Route::patch('settings', [BusinessSettingsController::class, 'update']);

            Route::get('subscriptions', [SubscriptionController::class, 'index']);
            Route::post('subscriptions/{moduleSlug}/activate', [SubscriptionController::class, 'activate']);
            Route::delete('subscriptions/{moduleSlug}', [SubscriptionController::class, 'deactivate']);

            Route::get('leads', [LeadController::class, 'index']);
            Route::post('leads', [LeadController::class, 'store']);
            Route::get('leads/{id}', [LeadController::class, 'show']);
            Route::patch('leads/{id}', [LeadController::class, 'update']);

            Route::get('webhooks', [WebhookController::class, 'index']);
            Route::post('webhooks', [WebhookController::class, 'store']);
            Route::delete('webhooks/{id}', [WebhookController::class, 'destroy']);
        });
    });

    Route::middleware('module.auth')->prefix('matrix')->group(function () {
        Route::get('auth/check', [MatrixController::class, 'authCheck']);
        Route::get('subscriptions/check/{slug}', [MatrixController::class, 'subscriptionCheck']);
        Route::get('connections', [MatrixController::class, 'connectionsList']);
        Route::get('connections/{provider}', [MatrixController::class, 'connectionGet']);
        Route::post('tokens/check', [MatrixController::class, 'tokensCheck']);
        Route::post('tokens/consume', [MatrixController::class, 'tokensConsume']);
        Route::post('leads', [MatrixController::class, 'leadsCreate']);
        Route::patch('leads/{id}', [MatrixController::class, 'leadsUpdate']);
        Route::post('leads/{id}/events', [MatrixController::class, 'leadsEvent']);
        Route::post('webhooks/emit', [MatrixController::class, 'webhooksEmit']);
        Route::post('notify', [MatrixController::class, 'notify']);
    });
});
