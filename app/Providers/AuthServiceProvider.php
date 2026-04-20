<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
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
        Gate::define('gerant', function ($user) {
            return in_array($user->role, ['gerant', 'admin']);
        });

        Gate::define('employe', function ($user) {
            return in_array($user->role, ['employe', 'gerant', 'admin']);
        });
    }
}
