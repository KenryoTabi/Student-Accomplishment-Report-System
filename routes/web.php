<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Http\Controllers\UserController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class)->name('index', 'users');
    
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // Route::inertia('users', 'users')->name('users');
    Route::inertia('accomplishment','accomplishment')->name('accomplishment');

});

require __DIR__.'/settings.php';
