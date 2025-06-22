<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostProxyController;

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/AR', function () {
    return Inertia::render('WelcomeAR');
})->name('homeAR');

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


//DATA INFORME
Route::get('showAgentRankingState', function () {
    return Inertia::render('agentState');
})->name('showAgentRankingState');
Route::get('showCallState', function () {
    return Inertia::render('callState');
})->name('showCallState');
Route::get('showOperationState', function () {
    return Inertia::render('operationState');
})->name('showOperationState');





// USUARIOS
Route::get('users', function () {
    return Inertia::render('users/index');
})->name('users');
Route::get('users/create', function () {
    return Inertia::render('users/create');
})->name('users-create');
Route::get('users/index', [UserController::class, 'index'])->name('user_index');
Route::get('users/creates', [UserController::class, 'create'])->name('user_creates');
Route::post('users.store', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::get('/user/data', [UserController::class, 'data']);

// AREAS
Route::get('areas', function () {
    return Inertia::render('areas/index');
})->name('areas');
Route::get('areas/create', function () {
    return Inertia::render('areas/create');
})->name('areas-create');
Route::get('areas/index', [AreaController::class, 'index'])->name('user_index');
Route::post('areas.store', [AreaController::class, 'store'])->name('areas.store');
Route::get('/areas/{id}/show', [AreaController::class, 'show']);
Route::put('/areas/{id}/edit', [AreaController::class, 'update']);




Route::get('/escuchar', function () {
    $ext = request('ext', '7001'); // extensión por defecto
    $comando = "asterisk -x \"channel originate SIP/5300 extension 12453143{$ext}@from-internal\"";
    $output = shell_exec($comando);
    return response()->json(['status' => 'OK', 'output' => $output])
                     ->header('Access-Control-Allow-Origin', '*');
});

Route::get('/getDonutCalls', [PostProxyController::class, 'getDonutCalls']);
Route::get('/getAgentRanking', [PostProxyController::class, 'rankingCalls']);
Route::get('/getOverview', [PostProxyController::class, 'getOverview']);

Route::get('/mi-ip', function () {
    return request()->ip(); // o $_SERVER['REMOTE_ADDR']
});

Route::get('/hojacv', function () {
    return view('hojacv');
});