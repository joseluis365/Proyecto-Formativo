<?php

use Illuminate\Support\Facades\Route;
use App\Models\Activity;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SuperadminAuthController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\LicenciaController;
use App\Http\Controllers\Api\EmpresaLicenciaController;
use App\Http\Controllers\Api\RegistroEmpresaController;
use App\Http\Controllers\Api\LicenciaChartController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\EspecialidadesController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\PrioridadController;
use App\Http\Controllers\Api\TipoCitaController;
use App\Http\Controllers\Api\CategoriaExamenController;
use App\Http\Controllers\Api\CategoriaMedicamentoController;
use App\Http\Controllers\Api\FarmaciaController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\CiudadController;

/*
|--------------------------------------------------------------------------
| 🔐 AUTENTICACIÓN USUARIOS
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendRecoveryCode']);
Route::post('/verify-recovery-code', [AuthController::class, 'verifyRecoveryCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| 🔐 AUTENTICACIÓN SUPERADMIN
|--------------------------------------------------------------------------
*/

Route::prefix('superadmin')->group(function () {
    Route::post('/login', [SuperadminAuthController::class, 'login']);
    Route::post('/verificar-codigo', [SuperadminAuthController::class, 'verificarCodigo']);
    Route::post('/forgot-password', [SuperadminAuthController::class, 'sendRecoveryCode']);
    Route::post('/verify-recovery-code', [SuperadminAuthController::class, 'verifyRecoveryCode']);
    Route::post('/reset-password', [SuperadminAuthController::class, 'resetPassword']);
});

/*
|--------------------------------------------------------------------------
| 🌐 RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

Route::get('/especialidades', [EspecialidadesController::class, 'select']);
Route::get('/departamentos', [LocationController::class, 'getDepartamentos']);
Route::get('/ciudades/{departamentoId}', [LocationController::class, 'getCiudades']);

Route::get('/recent-activity/{channelName}', function ($channel) {
    return Activity::latest()
        ->take(5)
        ->get()
        ->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'type' => $activity->type,
                'icon' => $activity->icon,
                'time' => $activity->created_at->diffForHumans(),
            ];
        });
});

/*
|--------------------------------------------------------------------------
| 🔒 RUTAS PROTEGIDAS USUARIO NORMAL
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'licencia.activa'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | USUARIOS
    |--------------------------------------------------------------------------
    */

    Route::controller(UsuarioController::class)->group(function () {
        Route::get('/usuarios', 'index');
        Route::get('/usuario/{id}', 'show');
        Route::post('/usuario', 'store');
        Route::put('/usuario/{id}', 'update');
        Route::put('/usuario/{id}/estado', 'updateEstado');
        Route::delete('/usuario/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CITAS
    |--------------------------------------------------------------------------
    */

    Route::controller(CitaController::class)->group(function () {
        Route::get('/citas', 'index');
        Route::get('/cita/{id}', 'show');
        Route::post('/cita', 'store');
        Route::put('/cita/{id}', 'update');
        Route::delete('/cita/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — PRIORIDADES (CRUD ADMIN NORMAL)
    |--------------------------------------------------------------------------
    */

    Route::controller(PrioridadController::class)->group(function () {
        Route::get('/prioridades', 'index');
        Route::post('/prioridades', 'store');
        Route::put('/prioridades/{id}', 'update');
        Route::delete('/prioridades/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — TIPO CITA
    |--------------------------------------------------------------------------
    */

    Route::controller(TipoCitaController::class)->group(function () {
        Route::get('/tipos-cita', 'index');
        Route::post('/tipos-cita', 'store');
        Route::put('/tipos-cita/{id}', 'update');
        Route::delete('/tipos-cita/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — CATEGORÍA EXAMEN
    |--------------------------------------------------------------------------
    */

    Route::controller(CategoriaExamenController::class)->group(function () {
        Route::get('/categorias-examen', 'index');
        Route::post('/categorias-examen', 'store');
        Route::put('/categorias-examen/{id}', 'update');
        Route::delete('/categorias-examen/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — CATEGORÍA MEDICAMENTO
    |--------------------------------------------------------------------------
    */

    Route::controller(CategoriaMedicamentoController::class)->group(function () {
        Route::get('/categorias-medicamento', 'index');
        Route::post('/categorias-medicamento', 'store');
        Route::put('/categorias-medicamento/{id}', 'update');
        Route::delete('/categorias-medicamento/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN — FARMACIAS
    |--------------------------------------------------------------------------
    */

    Route::controller(FarmaciaController::class)->group(function () {
        Route::get('/farmacias', 'index');
        Route::post('/farmacias', 'store');
        Route::put('/farmacias/{nit}', 'update');
        Route::delete('/farmacias/{nit}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — ESPECIALIDADES (CRUD ADMIN)
    |--------------------------------------------------------------------------
    |*/

    Route::controller(EspecialidadesController::class)->group(function () {
        Route::get('/configuracion/especialidades', 'index');
        Route::post('/configuracion/especialidades', 'store');
        Route::put('/configuracion/especialidades/{id}', 'update');
        Route::delete('/configuracion/especialidades/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — DEPARTAMENTOS
    |--------------------------------------------------------------------------
    |*/

    Route::controller(DepartamentoController::class)->group(function () {
        Route::get('/configuracion/departamentos', 'index');
        Route::post('/departamentos', 'store');
        Route::put('/departamentos/{codigo_DANE}', 'update');
        Route::delete('/departamentos/{codigo_DANE}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — CIUDADES
    |--------------------------------------------------------------------------
    |*/

    Route::controller(CiudadController::class)->group(function () {
        Route::get('/configuracion/ciudades', 'index');
        Route::post('/ciudades', 'store');
        Route::put('/ciudades/{codigo_postal}', 'update');
        Route::delete('/ciudades/{codigo_postal}', 'destroy');
    });

});

/*
|--------------------------------------------------------------------------
| 🔒 RUTAS PROTEGIDAS SUPERADMIN
|--------------------------------------------------------------------------
*/

Route::prefix('superadmin')->middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [SuperadminAuthController::class, 'logout']);
    Route::get('/check-session', [SuperadminAuthController::class, 'checkSession']);
    Route::get('/dashboard-stats', [EmpresaController::class, 'getDashboardStats']);

    /*
    |--------------------------------------------------------------------------
    | EMPRESAS
    |--------------------------------------------------------------------------
    */

    Route::controller(EmpresaController::class)->group(function () {
        Route::get('/empresas', 'index');
        Route::get('/empresa/{id}', 'show');
        Route::post('/empresa', 'store');
        Route::put('/empresa/{id}', 'update');
        Route::delete('/empresa/{id}', 'destroy');
        Route::get('/empresas/pdf', 'exportPdf');
        Route::get('/empresa/{id}/pdf', 'exportCompanyPdf');
    });

    /*
    |--------------------------------------------------------------------------
    | LICENCIAS
    |--------------------------------------------------------------------------
    */

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
        Route::get('/licencias/historial/pdf', 'exportHistoryPdf');
    });

    Route::post('/registrar-empresa-licencia', [RegistroEmpresaController::class, 'store']);
    Route::get('/licenses/chart-data', [LicenciaChartController::class, 'getMonthlyStats']);

    /*
    |--------------------------------------------------------------------------
    | REPORTES
    |--------------------------------------------------------------------------
    */

    Route::get('/descargar-reporte', [ReporteController::class, 'generarPdf']);

});