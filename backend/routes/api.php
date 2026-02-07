<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// 🔓 Login
Route::post('/login', [AuthController::class, 'login']);

// 🔐 Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::get('/usuarios/{documento}', [UserController::class, 'show']);
    Route::put('/usuarios/{documento}', [UserController::class, 'update']);
    Route::delete('/usuarios/{documento}', [UserController::class, 'destroy']);
});
