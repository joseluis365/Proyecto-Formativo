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

Route::get('/especialidades', [EspecialidadesController::class, 'index']);
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
| 🔒 RUTAS PROTEGIDAS
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | SUPERADMIN
    |--------------------------------------------------------------------------
    */

    Route::post('/superadmin/logout', [SuperadminAuthController::class, 'logout']);
    Route::get('/superadmin/check-session', [SuperadminAuthController::class, 'checkSession']);
    Route::get('/superadmin/dashboard-stats', [EmpresaController::class, 'getDashboardStats']);

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

});
