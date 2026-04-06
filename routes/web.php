<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::get('/dashboard', function () {
    return view('pages.dashboard.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::view('/error-404', 'pages.errors.404')->name('pages.error404');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/inventory', 'pages.inventory.index')->name('pages.inventory');
    Route::view('/inventory/create-product', 'pages.inventory.create-product')->name('pages.inventory.create');
    Route::view('/reports', 'pages.reports.index')->name('pages.reports');
    Route::view('/docs', 'pages.docs.index')->name('pages.docs');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
