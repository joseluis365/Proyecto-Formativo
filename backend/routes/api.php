<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SuperadminAuthController;

// ==============================
// 🔐 SUPERADMIN
// ==============================
Route::post('/superadmin/login', [SuperadminAuthController::class, 'login']);
Route::post('/superadmin/verificar-codigo', [SuperadminAuthController::class, 'verificarCodigo']);


