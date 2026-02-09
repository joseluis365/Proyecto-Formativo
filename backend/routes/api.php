<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SuperadminAuthController;

// ==============================
// 🔓 LOGIN USUARIO NORMAL
// ==============================
Route::post('/login', [AuthController::class, 'login']);

// ==============================
// 🔐 SUPERADMIN (2FA SIN TOKEN)
// ==============================
Route::prefix('superadmin')->group(function () {
    Route::post('/login', [SuperadminAuthController::class, 'login']);
    Route::post('/verificar-codigo', [SuperadminAuthController::class, 'verificarCodigo']);
});
