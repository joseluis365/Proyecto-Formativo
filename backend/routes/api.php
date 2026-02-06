<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Rutas públicas (NO requieren token)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren token Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // 🔐 Sesión
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 👤 CRUD de usuarios
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::get('/usuarios/{documento}', [UserController::class, 'show']);
    Route::put('/usuarios/{documento}', [UserController::class, 'update']);
    Route::delete('/usuarios/{documento}', [UserController::class, 'destroy']);
});
