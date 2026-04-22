<?php

use App\Http\Controllers\AccomplishmentReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class)->name('index', 'users');
    Route::resource('user-tasks', TaskController::class)->name('index', 'user-tasks');
    Route::resource('accomplishment-report', AccomplishmentReportController::class)->name('index', 'accomplishment-report');

    Route::inertia('dashboard', 'dashboard/index')->name('dashboard');

    Route::get('/reports/{id}/print', [AccomplishmentReportController::class, 'generateReportFile'])
    ->name('pdf.report');
});

require __DIR__.'/settings.php';
