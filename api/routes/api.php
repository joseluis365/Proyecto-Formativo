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
use App\Http\Controllers\Api\EnfermedadController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\PrioridadController;
use App\Http\Controllers\Api\TipoCitaController;
use App\Http\Controllers\Api\CategoriaExamenController;
use App\Http\Controllers\Api\CategoriaMedicamentoController;
use App\Http\Controllers\Api\FarmaciaController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\CiudadController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\EstadoController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\PqrController;
use App\Http\Controllers\Api\MotivoConsultaController;
use App\Http\Controllers\Api\PersonalReporteController;
// Farmacia módulo
use App\Http\Controllers\Api\MedicamentoController;
use App\Http\Controllers\Api\InventarioFarmaciaController;
use App\Http\Controllers\Api\MovimientoInventarioController;
use App\Http\Controllers\Api\RecetaFarmaciaController;
use App\Http\Controllers\Api\DispensacionController;
use App\Http\Controllers\Api\FarmaciaDashboardController;
use App\Http\Controllers\Api\FarmaciaReportesController;
// Módulo Médico / Paciente
use App\Http\Controllers\Api\AtencionMedicaController;
use App\Http\Controllers\Api\HistorialClinicoController;
use App\Http\Controllers\Api\ExamenClinicoController;
use App\Http\Controllers\Api\PdfMedicoController;
use App\Http\Controllers\Api\ConsultorioController;
use App\Http\Controllers\Api\ExamenReporteController;
use App\Http\Controllers\Api\NotificacionPacienteController;



/*
|--------------------------------------------------------------------------
| 🔐 AUTENTICACIÓN USUARIOS
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-2fa', [AuthController::class, 'verify2FA']);
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
Route::get('/tipos-documento', [\App\Http\Controllers\Api\TipoDocumentoController::class, 'index']);
Route::get('/departamentos', [LocationController::class, 'getDepartamentos']);
Route::get('/ciudades/{departamentoId}', [LocationController::class, 'getCiudades']);
Route::get('/licencias', [LicenciaController::class, 'index']);
Route::get('/licencia/{id}', [LicenciaController::class, 'show']);
Route::post('/registrar-empresa-licencia', [RegistroEmpresaController::class, 'store']);
Route::get('/motivos-consulta', [MotivoConsultaController::class, 'index']);
Route::post('/contacto', [PqrController::class, 'store']);

Route::get('/recent-activity/{channelName}', function ($channel) {
    return Activity::where('channel_name', $channel)
        ->latest()
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
    | SESIÓN
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD ADMIN — ESTADÍSTICAS
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/dashboard/citas-semana', function () {
        $days = [];
        $today = \Carbon\Carbon::now();

        // Generar los 7 días: desde hace 6 días hasta hoy
        for ($i = 6; $i >= 0; $i--) {
            $day = $today->copy()->subDays($i);
            $days[] = [
                'date'  => $day->toDateString(),
                'dia'   => $day->locale('es')->isoFormat('ddd'), // Lun, Mar, ...
                'total' => \App\Models\Cita::whereDate('fecha', $day->toDateString())->count(),
            ];
        }

        return response()->json(['data' => $days]);
    });

    Route::get('/admin/dashboard/stats', [AdminDashboardController::class, 'getStats']);
    Route::get('/admin/dashboard/ordenes-mes', [AdminDashboardController::class, 'getOrdenesMes']);

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
        Route::put('/citas/{id}/reagendar', 'reagendar');
        Route::patch('/cita/{id}/no-asistio', 'noAsistio');
    });

    /*
    |--------------------------------------------------------------------------
    | PDF MÉDICO — Descargas DOMpdf
    |--------------------------------------------------------------------------
    */
    Route::get('/pdf/cita/{id}', [PdfMedicoController::class, 'citaPdf']);
    Route::get('/pdf/remision/{id}', [PdfMedicoController::class, 'remisionPdf']);
    Route::get('/pdf/receta/{id}', [PdfMedicoController::class, 'recetaPdf']);

    /*
    |--------------------------------------------------------------------------
    | ATENCIÓN MÉDICA
    |--------------------------------------------------------------------------
    */
    Route::post('/cita/{id}/atender', [AtencionMedicaController::class, 'atender']);

    /*
    |--------------------------------------------------------------------------
    | HISTORIAL CLÍNICO Y PACIENTES (MÉDICO / PACIENTE)
    |--------------------------------------------------------------------------
    */
    Route::get('/medico/pacientes', [HistorialClinicoController::class, 'misPacientes']);
    Route::get('/paciente/{doc}/historial', [HistorialClinicoController::class, 'show']);
    Route::get('/paciente/{doc}/historial/completo', [HistorialClinicoController::class, 'completo']);
    Route::get('/paciente/{doc}/historial/detalles', [HistorialClinicoController::class, 'detalles']);
    Route::put('/paciente/{doc}/historial', [HistorialClinicoController::class, 'updateAntecedentes']);
    Route::get('/paciente/{doc}/historial/pdf', [HistorialClinicoController::class, 'exportPdf']);
    Route::get('/paciente/{doc}/historial/evolucion', [HistorialClinicoController::class, 'evolucion']);
    Route::post('/paciente/{doc}/historial/evolucion/pdf', [HistorialClinicoController::class, 'exportEvolucionPdf']);

    /*
    |--------------------------------------------------------------------------
    | ENFERMEDADES (CIE-11 ICD)
    |--------------------------------------------------------------------------
    | Se coloca fuera de superadmin para que los médicos puedan diagnosticar.
    */
    Route::get('/enfermedades/buscar', [EnfermedadController::class, 'buscar']);
    Route::get('/enfermedades', [EnfermedadController::class, 'index']);
    Route::post('/enfermedades', [EnfermedadController::class, 'store']);
    Route::put('/enfermedades/{codigo_icd}', [EnfermedadController::class, 'update']);
    Route::delete('/enfermedades/{codigo_icd}', [EnfermedadController::class, 'destroy']);

    // Médicos disponibles (para agendar cita desde el portal paciente)
    Route::get('/medicos-disponibles', [UsuarioController::class, 'medicosDisponibles']);
    Route::get('/paciente/alertas', [NotificacionPacienteController::class, 'getAlertas']);


    /*
    |--------------------------------------------------------------------------
    | EXÁMENES CLÍNICOS (ROL 3 LABORATIO)
    |--------------------------------------------------------------------------
    */
    Route::get('/examenes/agenda', [ExamenClinicoController::class, 'agenda']);
    Route::get('/examenes/mis-examenes', [ExamenClinicoController::class, 'misExamenes']);
    Route::get('/examenes/{id}', [ExamenClinicoController::class, 'show']);
    Route::post('/examenes/{id}/atender', [ExamenClinicoController::class, 'atender']);
    Route::get('/examenes/{id}/resultado', [ExamenClinicoController::class, 'descargarResultado']);
    Route::get('/categorias-examen', [ExamenClinicoController::class, 'obtenerCategorias']);
    Route::post('/categorias-examen', [ExamenClinicoController::class, 'guardarCategoria']);
    Route::put('/categorias-examen/{id}', [ExamenClinicoController::class, 'actualizarCategoria']);
    Route::delete('/categorias-examen/{id}', [ExamenClinicoController::class, 'eliminarCategoria']);

    // Listar farmacias activas — para modal de prescripción en consulta médica
    Route::get('/farmacias', [FarmaciaController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | PQRS (PETICIONES, QUEJAS, RECLAMOS, SUGERENCIAS)
    |--------------------------------------------------------------------------
    */
    Route::get('/pqrs', [PqrController::class, 'index']);
    Route::post('/pqrs/{id}/responder', [PqrController::class, 'responder']);


    // Listar consultorios (para perfil de médico)
    Route::get('/consultorios', [ConsultorioController::class, 'index']);
    Route::get('/consultorios/disponibles', [ConsultorioController::class, 'disponibles']);

    // Recetas del paciente (para panel de medicamentos activos)
    Route::get('/paciente/{doc}/recetas', function ($doc) {
        $recetas = \App\Models\Receta::with([
            'estado',
            'historialDetalle.cita',
            'recetaDetalles.presentacion.medicamento',
            'recetaDetalles.presentacion.concentracion',
            'recetaDetalles.presentacion.formaFarmaceutica',
            'recetaDetalles.farmacia',
            'recetaDetalles.dispensacion.estado',
        ])
        ->whereHas('historialDetalle.cita', function ($q) use ($doc) {
            $q->where('doc_paciente', $doc);
        })
        ->latest()
        ->get();

        return response()->json(['data' => $recetas]);
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
    | CONFIGURACIÓN — COMPONENTES MEDICAMENTOS
    |--------------------------------------------------------------------------
    |*/

    Route::controller(\App\Http\Controllers\Api\ConcentracionController::class)->group(function () {
        Route::get('/configuracion/concentraciones', 'index');
        Route::post('/configuracion/concentraciones', 'store');
        Route::put('/configuracion/concentraciones/{id}', 'update');
        Route::delete('/configuracion/concentraciones/{id}', 'destroy');
    });

    Route::controller(\App\Http\Controllers\Api\FormaFarmaceuticaController::class)->group(function () {
        Route::get('/configuracion/formas-farmaceuticas', 'index');
        Route::post('/configuracion/formas-farmaceuticas', 'store');
        Route::put('/configuracion/formas-farmaceuticas/{id}', 'update');
        Route::delete('/configuracion/formas-farmaceuticas/{id}', 'destroy');
    });

    Route::controller(\App\Http\Controllers\Api\AdminMedicamentoController::class)->group(function () {
        Route::get('/configuracion/medicamentos', 'index');
        Route::post('/configuracion/medicamentos', 'store');
        Route::put('/configuracion/medicamentos/{id}', 'update');
        Route::delete('/configuracion/medicamentos/{id}', 'destroy');
    });

    Route::controller(\App\Http\Controllers\Api\AdminPresentacionController::class)->group(function () {
        Route::get('/configuracion/presentaciones', 'index');
        Route::post('/configuracion/presentaciones', 'store');
        Route::put('/configuracion/presentaciones/{id}', 'update');
        Route::delete('/configuracion/presentaciones/{id}', 'destroy');
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

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — ROLES
    |--------------------------------------------------------------------------
    |*/

    Route::controller(RolController::class)->group(function () {
        Route::get('/configuracion/roles', 'index');
        Route::post('/roles', 'store');
        Route::put('/roles/{id_rol}', 'update');
        Route::delete('/roles/{id_rol}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — ESTADOS
    |--------------------------------------------------------------------------
    |*/

    Route::controller(EstadoController::class)->group(function () {
        Route::get('/configuracion/estados', 'index');
        Route::post('/estados', 'store');
        Route::put('/estados/{id_estado}', 'update');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — MOTIVOS DE CONSULTA
    |--------------------------------------------------------------------------
    |*/

    Route::controller(MotivoConsultaController::class)->group(function () {
        Route::post('/motivos-consulta', 'store');
        Route::put('/motivos-consulta/{id}', 'update');
        Route::delete('/motivos-consulta/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | CONFIGURACIÓN — TIPOS DE DOCUMENTO
    |--------------------------------------------------------------------------
    |*/

    Route::controller(\App\Http\Controllers\Api\TipoDocumentoController::class)->group(function () {
        Route::post('/tipos-documento', 'store');
        Route::put('/tipos-documento/{id}', 'update');
        Route::delete('/tipos-documento/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO FARMACIA — CATÁLOGO
    |--------------------------------------------------------------------------
    */

    Route::prefix('farmacia')->group(function () {
        // Catálogo de medicamentos (presentaciones)
        Route::get('/medicamentos', [MedicamentoController::class, 'index']);
        Route::post('/medicamento', [MedicamentoController::class, 'store']);
        Route::post('/medicamento/{id_medicamento}/presentacion', [MedicamentoController::class, 'storePresentacion']);
        Route::put('/medicamento/{id}/estado', [MedicamentoController::class, 'toggleEstado']);
        Route::get('/medicamentos/disponibilidad', [MedicamentoController::class, 'disponibilidad']);

        // Selects
        Route::get('/categorias', [MedicamentoController::class, 'categorias']);
        Route::get('/concentraciones', [MedicamentoController::class, 'concentraciones']);
        Route::get('/formas-farmaceuticas', [MedicamentoController::class, 'formasFarmaceuticas']);

        // Inventario
        Route::get('/inventario', [InventarioFarmaciaController::class, 'index']);
        Route::get('/inventario/por-presentacion/{id}', [InventarioFarmaciaController::class, 'porPresentacion']);
        Route::post('/inventario/entrada', [InventarioFarmaciaController::class, 'registrarEntrada']);
        // Lotes disponibles (para selector de Salida Manual)
        Route::get('/lotes', [InventarioFarmaciaController::class, 'lotesDisponibles']);

        // Movimientos
        Route::get('/movimientos', [MovimientoInventarioController::class, 'index']);
        Route::post('/movimientos/salida', [MovimientoInventarioController::class, 'registrarSalida']);

        // Recetas pendientes para esta farmacia
        Route::get('/recetas-pendientes', [RecetaFarmaciaController::class, 'index']);
        Route::get('/receta/{id}', [RecetaFarmaciaController::class, 'show']);

        // Dispensación
        Route::post('/dispensar', [DispensacionController::class, 'dispensar']);
        Route::get('/dispensaciones', [DispensacionController::class, 'index']);

        // Dashboard
        Route::get('/dashboard/stats', [FarmaciaDashboardController::class, 'stats']);

        // Reportes
        Route::get('/reportes/{entity}', [FarmaciaReportesController::class, 'index']);
        Route::get('/reportes/{entity}/export', [FarmaciaReportesController::class, 'export']);
    });

    /*
    |--------------------------------------------------------------------------
    | REPORTES DINÁMICOS
    |--------------------------------------------------------------------------
    |*/

    Route::prefix('reportes')->group(function () {
        Route::get('historial', [ReportController::class, 'getHistorial']);
        Route::get('{entity}', [ReportController::class, 'index']);
        Route::get('{entity}/export', [ReportController::class, 'export']);
    });

    /*
    |--------------------------------------------------------------------------
    | REPORTES PERSONAL ADMINISTRATIVO
    |--------------------------------------------------------------------------
    |*/

    Route::prefix('personal/reportes')->group(function () {
        Route::get('{entity}', [PersonalReporteController::class, 'index']);
        Route::get('{entity}/export', [PersonalReporteController::class, 'export']);
    });

    // Reportes de Exámenes (Laboratorio - Rol 3)
    Route::prefix('examenes/reportes')->group(function () {
        Route::get('{entity}', [ExamenReporteController::class, 'index']);
        Route::get('{entity}/export', [ExamenReporteController::class, 'export']);
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


    Route::get('/licenses/chart-data', [LicenciaChartController::class, 'getMonthlyStats']);

    /*
    |--------------------------------------------------------------------------
    | REPORTES
    |--------------------------------------------------------------------------
    */

    Route::get('/descargar-reporte', [ReporteController::class, 'generarPdf']);

});