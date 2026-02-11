<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SuperadminAuthController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\LicenciaController;
use App\Http\Controllers\Api\EmpresaLicenciaController;
use App\Http\Controllers\Api\RegistroEmpresaController;
use App\Http\Controllers\Api\PersonalController;

/*
|--------------------------------------------------------------------------
| 🔐 SUPERADMIN
|--------------------------------------------------------------------------
*/

Route::post('/superadmin/login', [SuperadminAuthController::class, 'login']);
Route::post('/superadmin/verificar-codigo', [SuperadminAuthController::class, 'verificarCodigo']);

/*
|--------------------------------------------------------------------------
| 🏢 EMPRESAS
|--------------------------------------------------------------------------
*/

Route::get('/empresas', [EmpresaController::class, 'index']);
Route::get('/empresa/{id}', [EmpresaController::class, 'show']);
Route::post('/empresa', [EmpresaController::class, 'store']);
Route::put('/empresa/{id}', [EmpresaController::class, 'update']);
Route::delete('/empresa/{id}', [EmpresaController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| 📄 LICENCIAS
|--------------------------------------------------------------------------
*/

Route::get('/licencias', [LicenciaController::class, 'index']);
Route::get('/licencia/{id}', [LicenciaController::class, 'show']);
Route::post('/licencia', [LicenciaController::class, 'store']);
Route::put('/licencia/{id}', [LicenciaController::class, 'update']);
Route::delete('/licencia/{id}', [LicenciaController::class, 'destroy']);
Route::get('/licencias/pendientes', [LicenciaController::class, 'pendientes']);
Route::post('/licencias/activar/{id}', [LicenciaController::class, 'activar']);

/*
|--------------------------------------------------------------------------
| 🔗 EMPRESA LICENCIA
|--------------------------------------------------------------------------
*/

Route::get('/empresa-licencias', [EmpresaLicenciaController::class, 'index']);
Route::post('/empresa-licencia', [EmpresaLicenciaController::class, 'store']);
Route::post('/empresa/{nit}/activar-licencia', [EmpresaLicenciaController::class, 'activate']);

/*
|--------------------------------------------------------------------------
| 📝 REGISTRO EMPRESA + LICENCIA
|--------------------------------------------------------------------------
*/

Route::post('/registrar-empresa-licencia', [RegistroEmpresaController::class, 'store']);

/*
|--------------------------------------------------------------------------
| 👥 PERSONAL
|--------------------------------------------------------------------------
*/

Route::get('/personal', [PersonalController::class, 'index']);
Route::get('/personal/{id}', [PersonalController::class, 'show']);
Route::post('/personal', [PersonalController::class, 'store']);
Route::put('/personal/{id}', [PersonalController::class, 'update']);
Route::delete('/personal/{id}', [PersonalController::class, 'destroy']);
