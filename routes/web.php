<?php

use App\Http\Controllers\UserController;
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
Route::get('editAgent/{agent}', function ($agent) {
    return Inertia::render('editAgent', [
        'agent' => $agent
    ]);
})->name('editAgent');


Route::get('editAgent/{agent}', function ($agent) {
    return Inertia::render('editAgent', [
        'agent' => $agent
    ]);
})->name('editAgent');

Route::get('users', function () {
    return Inertia::render('users/index');
})->name('users');
Route::get('users/create', function () {
    return Inertia::render('users/create');
})->name('users-create');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('users/index', [UserController::class, 'index'])->name('user_index');
Route::get('users/creates', [UserController::class, 'create'])->name('user_creates');
Route::post('users.store', [UserController::class, 'store'])->name('users.store');


Route::get('/escuchar', function () {
    $ext = request('ext', '7001'); // extensión por defecto
    $comando = "asterisk -x \"channel originate SIP/5300 extension 12453143{$ext}@from-internal\"";
    $output = shell_exec($comando);
    return response()->json(['status' => 'OK', 'output' => $output])
                     ->header('Access-Control-Allow-Origin', '*');
});