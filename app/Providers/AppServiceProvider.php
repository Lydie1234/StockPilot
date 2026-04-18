<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\StockMovement;
use App\Observers\StockMovementObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        \App\Models\StockMovement::observe(\App\Models\Observers\StockMovementObserver::class);

        StockMovement::observe(StockMovementObserver::class);

    }
}
