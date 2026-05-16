<?php

use App\Http\Middleware\AuthenticateModule;
use App\Http\Middleware\EnsureOrgAdmin;
use App\Http\Middleware\EnsureSuperadmin;
use App\Http\Middleware\ResolveBusinessContext;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'module.auth' => AuthenticateModule::class,
            'org.admin' => EnsureOrgAdmin::class,
            'superadmin' => EnsureSuperadmin::class,
            'business.context' => ResolveBusinessContext::class,
            'tenant.user' => \App\Http\Middleware\SetUserTenant::class,
        ]);
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
