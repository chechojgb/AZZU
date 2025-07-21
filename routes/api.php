<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostProxyController;
use App\Http\Controllers\SpyController;
use App\Models\SshSession;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/stats/{area}', [PostProxyController::class, 'index']);
Route::get('/agents/{area}', [PostProxyController::class, 'usersTable']);
Route::get('/agent/{extension}', [PostProxyController::class, 'userData']);
Route::post('/hangup-channel', [PostProxyController::class, 'chanelHangup']);
Route::post('/pause-extension', [PostProxyController::class, 'pauseExtension']);
Route::post('/unpause-extension', [PostProxyController::class, 'unpauseExtension']);
Route::post('/transfer-call', [PostProxyController::class, 'channelTransfer']);
Route::get('/getCallsPerOperation', [PostProxyController::class, 'getCallsPerOperation']);
Route::get('/operationState/{area}', [PostProxyController::class, 'operationState']);
Route::get('/operationPromState/{area}', [PostProxyController::class, 'operationPromState']);
Route::get('/operationStatusAgentOperation/{area}', [PostProxyController::class, 'operationAgentSatus']);
// routes/api.php
Route::post('/spy', [SpyController::class, 'start']);

Route::get('/ssh-sessions/{id}', function ($id) {
    return SshSession::findOrFail($id);
});