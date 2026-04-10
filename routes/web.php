<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
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
