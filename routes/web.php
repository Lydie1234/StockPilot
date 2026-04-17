<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        if (in_array($user->role, ['gerant', 'admin'])) {
            return redirect()->route('dashboard');
        }
        return redirect()->route('pages.inventory');
    }
    return redirect()->route('login');
});

// Auth routes (Laravel Breeze/Jetstream assumed installed)
//require __DIR__.'/auth.php';

// RESTful routes
Route::middleware(['auth'])->group(function () {
    Route::apiResource('categories', App\Http\Controllers\CategoryController::class);
    Route::apiResource('products', App\Http\Controllers\ProductController::class);
    Route::get('products-below-threshold', [App\Http\Controllers\ProductController::class, 'belowThreshold']);
    Route::apiResource('stock-movements', App\Http\Controllers\StockMovementController::class)->only(['index', 'store', 'show']);
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index']);
    Route::get('reports/top-products-out', [App\Http\Controllers\ReportController::class, 'topProductsOut']);
    Route::get('reports/history', [App\Http\Controllers\ReportController::class, 'history']);
});
Route::get('/dashboard', function () {
    return view('pages.dashboard.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/inventory', 'pages.inventory.index')->name('pages.inventory');
    Route::view('/inventory/create-product', 'pages.inventory.create-product')->name('pages.inventory.create');
    Route::view('/reports', 'pages.reports.index')->name('pages.reports');
    Route::view('/users', 'pages.users.index')->name('pages.users');
    Route::view('/settings', 'pages.settings.index')->name('pages.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
