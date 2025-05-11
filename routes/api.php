<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostProxyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/stats/{area}', [PostProxyController::class, 'index']);
Route::get('/agents/{area}', [PostProxyController::class, 'usersTable']);
Route::get('/agent/{extension}', [PostProxyController::class, 'userData']);
Route::get('/getOverview', [PostProxyController::class, 'getOverview']);
Route::post('/hangup-channel', [PostProxyController::class, 'chanelHangup']);
Route::post('/paused-extension', [PostProxyController::class, 'pausedExtension']);