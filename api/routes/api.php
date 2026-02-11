<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\PersonalController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\LicenciaController;
use App\Http\Controllers\Api\EmpresaLicenciaController;
use App\Http\Controllers\Api\RegistroEmpresaController;
use App\Http\Controllers\Api\AuthController; 

Route::post('/login', [AuthController::class, 'login']);

Route::controller(CitaController::class)->group(function () {
    Route::get('/citas', 'index');
    Route::get('/cita/{id}', 'show');
    Route::post('/cita', 'store');
    Route::put('/cita/{id}', 'update');
    Route::delete('/cita/{id}', 'destroy');
});

Route::controller(PersonalController::class)->group(function () {
    Route::get('/personal', 'index');
    Route::get('/personal/{id}', 'show');
    Route::post('/personal', 'store');
    Route::put('/personal/{id}', 'update');
    Route::delete('/personal/{id}', 'destroy');
});

Route::controller(EmpresaController::class)->group(function () {
    Route::get('/empresas', 'index');
    Route::get('/empresa/{id}', 'show');
    Route::post('/empresa', 'store');
    Route::put('/empresa/{id}', 'update');
    Route::delete('/empresa/{id}', 'destroy');
});

Route::controller(LicenciaController::class)->group(function () {
    Route::get('/licencias', 'index');
    Route::get('/licencia/{id}', 'show');
    Route::post('/licencia', 'store');
    Route::put('/licencia/{id}', 'update');
    Route::delete('/licencia/{id}', 'destroy');
    Route::get('/licencias/pendientes', 'pendientes');
    Route::post('/licencias/activar/{id}', 'activar');
});

Route::controller(EmpresaLicenciaController::class)->group(function () {
    Route::get('/empresa-licencias', 'index');
    Route::post('/empresa-licencia', 'store');
    Route::post('/empresa/{nit}/activar-licencia', 'activate');
});

Route::post('/registrar-empresa-licencia', [RegistroEmpresaController::class, 'store']);







