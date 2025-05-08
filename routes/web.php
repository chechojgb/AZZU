<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('perfil', function () {
    return Inertia::render('Perfil');
})->name('perfil');
Route::get('showTableAgents', function () {
    return Inertia::render('showTableAgents');
})->name('showTableAgents');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
