<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostProxyController;
use App\Http\Controllers\SpyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/stats/{area}', [PostProxyController::class, 'index']);
Route::get('/agents/{area}', [PostProxyController::class, 'usersTable']);
Route::get('/agent/{extension}', [PostProxyController::class, 'userData']);
Route::get('/getOverview', [PostProxyController::class, 'getOverview']);
Route::post('/hangup-channel', [PostProxyController::class, 'chanelHangup']);
Route::post('/pause-extension', [PostProxyController::class, 'pauseExtension']);
Route::post('/unpause-extension', [PostProxyController::class, 'unpauseExtension']);
Route::post('/transfer-call', [PostProxyController::class, 'channelTransfer']);
Route::get('/getCallsPerOperation', [PostProxyController::class, 'getCallsPerOperation']);

// routes/api.php
Route::post('/spy', [SpyController::class, 'start']);
