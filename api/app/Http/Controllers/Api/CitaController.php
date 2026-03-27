<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Estado;
use App\Models\Usuario;
use App\Http\Requests\StoreCitaRequest;
use App\Http\Requests\UpdateCitaRequest;
use App\Http\Requests\ReagendarCitaRequest;
use App\Mail\CitaAgendadaMailable;
use Illuminate\Support\Facades\Mail;
use App\Events\SystemActivityEvent;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // ---------------------------------------------------------
        // Lógica de auto-cancelación de citas no atendidas
        // ---------------------------------------------------------
        $estadoAgendada = Estado::where('nombre_estado', 'Agendada')->first();
        $estadoCancelada = Estado::where('nombre_estado', 'Cancelada')->first();

        if ($estadoAgendada && $estadoCancelada) {
            $now = \Carbon\Carbon::now();
            // Cancelar citas si han pasado 40 minutos desde la hora_inicio sin ser atendidas
            // (30 min de duración + 10 min de gracia)
            $cutoff = $now->copy()->subMinutes(40);
            Cita::where('id_estado', $estadoAgendada->id_estado)
                ->where(function ($query) use ($now, $cutoff) {
                    $query->where('fecha', '<', $now->toDateString())
                          ->orWhere(function ($q) use ($now, $cutoff) {
                              $q->where('fecha', $now->toDateString())
                                ->whereTime('hora_inicio', '<=', $cutoff->toTimeString());
                          });
                })->update(['id_estado' => $estadoCancelada->id_estado]);
        }
        // ---------------------------------------------------------

        $query = Cita::with([
            'paciente',
            'medico.especialidad',
            'medico.consultorio',
            'estado',
            'motivoConsulta',
            'especialidad',
            'historialDetalle.remisiones.especialidad',
            'historialDetalle.remisiones.categoriaExamen',
            'historialDetalle.remisiones.cita.medico',
            'historialDetalle.remisiones.cita.historialDetalle.enfermedades',
            'historialDetalle.remisiones.examen.categoriaExamen',
            'historialDetalle.remisiones.examen.estado',
            'historialDetalle.enfermedades',
            'historialDetalle.receta.estado',
            'historialDetalle.receta.recetaDetalles.presentacion.medicamento',
            'historialDetalle.receta.recetaDetalles.presentacion.concentracion',
            'historialDetalle.receta.recetaDetalles.presentacion.formaFarmaceutica',
            'historialDetalle.receta.recetaDetalles.farmacia',
        ]);

        // Seguridad: Si es paciente, solo puede ver sus propias citas
        if ($user->id_rol === 5) {
            $query->where('doc_paciente', $user->documento);
        } elseif ($user->id_rol === 4) {
            $query->where('doc_medico', $user->documento);
        } else {
            if ($request->has('doc_paciente')) {
                $query->where('doc_paciente', $request->doc_paciente);
            }
        }

        // Filtro: solo mostrar citas atendidas (con historialDetalle)
        if ($request->input('atendidas') === '1') {
            $query->whereHas('historialDetalle');
        }

        if ($request->has('fecha')) {
            $query->where('fecha', $request->fecha);
        }

        if ($request->has('doc_medico')) {
            $query->where('doc_medico', $request->doc_medico);
        }

        // Filtro: búsqueda por nombre/doc del paciente
        if ($request->has('busqueda') && $request->busqueda !== '') {
            $search = $request->busqueda;
            $query->whereHas('paciente', function ($q) use ($search) {
                $q->where('primer_nombre', 'ILIKE', "%{$search}%")
                  ->orWhere('primer_apellido', 'ILIKE', "%{$search}%")
                  ->orWhere('documento', 'ILIKE', "%{$search}%");
            });
        }

        // Filtro: filtrar por código ICD de enfermedad registrada en la atención
        if ($request->has('codigo_enfermedad') && $request->codigo_enfermedad !== '') {
            $query->whereHas('historialDetalle.enfermedades', function ($q) use ($request) {
                $q->where('enfermedades.codigo_icd', $request->codigo_enfermedad);
            });
        }

        // Filtro: motivo de consulta
        if ($request->has('id_motivo') && $request->id_motivo !== '') {
            $query->where('id_motivo', $request->id_motivo);
        }

        $perPage = $request->get('per_page', 15);
        $citas = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Citas obtenidas correctamente',
            'data' => $citas->items(),
            'current_page' => $citas->currentPage(),
            'last_page' => $citas->lastPage(),
            'total' => $citas->total(),
        ]);
    }

    public function show($id)
    {
        $cita = Cita::with([
            'paciente',
            'medico.especialidad',
            'medico.consultorio',
            'estado',
            'motivoConsulta',
            'especialidad',
            'historialDetalle.remisiones.especialidad',
            'historialDetalle.remisiones.categoriaExamen',
            'historialDetalle.remisiones.cita.medico',
            'historialDetalle.remisiones.cita.historialDetalle.enfermedades',
            'historialDetalle.remisiones.examen.categoriaExamen',
            'historialDetalle.remisiones.examen.estado',
            'historialDetalle.enfermedades',
            'historialDetalle.receta.estado',
            'historialDetalle.receta.recetaDetalles.presentacion.medicamento',
            'historialDetalle.receta.recetaDetalles.presentacion.concentracion',
            'historialDetalle.receta.recetaDetalles.presentacion.formaFarmaceutica',
            'historialDetalle.receta.recetaDetalles.farmacia',
        ])->find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada'
            ], 404);
        }

        // Anexar remisiones de forma directa (plana) para compatibilidad con el frontend
        if ($cita->historialDetalle) {
            $cita->remisiones = $cita->historialDetalle->remisiones;
        } else {
            $cita->remisiones = [];
        }

        return response()->json([
            'success' => true,
            'message' => 'Cita obtenida correctamente',
            'data' => $cita
        ]);
    }

    public function store(StoreCitaRequest $request)
    {
        // Calcular hora_fin (30 minutos después de hora_inicio)
        $horaFin = null;
        if ($request->hora_inicio) {
            $horaInicio = \Carbon\Carbon::createFromFormat('H:i', $request->hora_inicio);
            $horaFin = $horaInicio->copy()->addMinutes(30)->format('H:i');
        }

        // Get 'Agendada' status (ID 9)
        $estado = Estado::where('nombre_estado', 'Agendada')->first();
        $idEstado = $estado ? $estado->id_estado : 9;

        // Create the appointment
        $cita = Cita::create([
            'doc_paciente' => $request->doc_paciente,
            'doc_medico'   => $request->doc_medico,
            'fecha'        => $request->fecha,
            'motivo'       => $request->motivo,
            'id_motivo'    => $request->id_motivo,
            'id_especialidad' => $request->id_especialidad,
            'id_estado'    => $idEstado,
            'hora_inicio'  => $request->hora_inicio ?? null,
            'hora_fin'     => $horaFin,
        ]);

        // Get patient's email to send the confirmation
        $paciente = Usuario::where('documento', $request->doc_paciente)->first();
        if ($paciente && $paciente->email) {
            Mail::to($paciente->email)->send(new CitaAgendadaMailable($cita));
        }

        $nombrePaciente = $paciente
            ? trim($paciente->primer_nombre . ' ' . $paciente->primer_apellido)
            : $request->doc_paciente;

        event(new SystemActivityEvent(
            "Cita agendada: {$nombrePaciente} — {$cita->fecha}",
            'teal',
            'event_available',
            'admin-feed'
        ));

        return response()->json([
            'success' => true,
            'message' => 'Cita agendada correctamente y notificación enviada',
            'data'    => $cita
        ], 201);
    }

    public function update(UpdateCitaRequest $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada'
            ], 404);
        }

        $cita->update($request->validated());

        event(new SystemActivityEvent(
            "Cita actualizada — fecha: {$cita->fecha}",
            'orange',
            'edit_calendar',
            'admin-feed'
        ));

        return response()->json([
            'success' => true,
            'message' => 'Cita actualizada correctamente',
            'data'    => $cita
        ]);
    }

    public function destroy($id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada'
            ], 404);
        }

        $fechaCita = $cita->fecha;
        $estadoCancelada = Estado::firstOrCreate(['nombre_estado' => 'Cancelada']);
        $cita->update(['id_estado' => $estadoCancelada->id_estado]);

        event(new SystemActivityEvent(
            "Cita cancelada — fecha: {$fechaCita}",
            'red',
            'event_busy',
            'admin-feed'
        ));

        return response()->json([
            'message' => 'Cita eliminada correctamente'
        ]);
    }

    /**
     * Reagenda una cita: solo actualiza fecha y hora_inicio.
     * El médico y el motivo se mantienen intactos.
     *
     * PUT /api/citas/{id}/reagendar
     */
    public function reagendar(ReagendarCitaRequest $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada.'
            ], 404);
        }

        // Solo se permite reagendar citas en estado "Agendada" o "Pendiente"
        $estadosPermitidos = Estado::whereIn('nombre_estado', ['Agendada', 'Pendiente'])
            ->pluck('id_estado')
            ->toArray();

        if (!in_array($cita->id_estado, $estadosPermitidos)) {
            return response()->json([
                'message' => 'Solo se pueden reagendar citas en estado Agendada o Pendiente.'
            ], 422);
        }

        // Regla: No se puede reagendar si falta menos de 24 horas para la cita original
        if ($cita->fecha && $cita->hora_inicio) {
            $fechaHoraCitaOriginal = \Carbon\Carbon::parse($cita->fecha . ' ' . $cita->hora_inicio);
            if (\Carbon\Carbon::now()->addHours(24)->gte($fechaHoraCitaOriginal)) {
                return response()->json([
                    'message' => 'Las citas solo se pueden reagendar con al menos 24 horas de anticipación.'
                ], 422);
            }
        }

        // Recalcular hora_fin (30 min después)
        $horaInicio = \Carbon\Carbon::createFromFormat('H:i', $request->hora_inicio);
        $horaFin    = $horaInicio->copy()->addMinutes(30)->format('H:i');

        $cita->update([
            'fecha'       => $request->fecha,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin'    => $horaFin,
        ]);

        // Recargar relaciones para la respuesta
        $cita->load(['paciente', 'medico', 'estado']);

        return response()->json([
            'message' => 'Cita reagendada correctamente.',
            'data'    => $cita,
        ]);
    }

    /**
     * Marca una cita como "No Asistió".
     *
     * PATCH /api/cita/{id}/no-asistio
     */
    public function noAsistio(int $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada.'], 404);
        }

        // Permitir marcar inasistencia en citas Agendadas o Pendientes (ya que Canceladas por auto-cancelación no se pueden marcar después)
        $estadosPermitidos = Estado::whereIn('nombre_estado', ['Agendada', 'Pendiente'])
            ->pluck('id_estado')
            ->toArray();

        if (!in_array($cita->id_estado, $estadosPermitidos)) {
            return response()->json([
                'message' => 'Solo se pueden marcar como "No Asistió" citas Agendadas o Pendientes.'
            ], 422);
        }

        // Validar que la hora actual esté dentro de la ventana permitida:
        // Desde la hora_inicio hasta 40 minutos después
        if ($cita->fecha && $cita->hora_inicio) {
            $now = \Carbon\Carbon::now();
            $citaTime = \Carbon\Carbon::parse($cita->fecha . ' ' . $cita->hora_inicio);
            $citaTimeLimit = $citaTime->copy()->addMinutes(40);

            if ($now->lt($citaTime)) {
                return response()->json([
                    'message' => 'Aún no es la hora de la cita. No se puede marcar inasistencia.'
                ], 422);
            }

            if ($now->gt($citaTimeLimit)) {
                return response()->json([
                    'message' => 'Han pasado más de 40 minutos desde el inicio de la cita. No se puede marcar inasistencia manualmente.'
                ], 422);
            }
        }

        // Cambiar estado a "Inasistencia"
        $estadoInasistencia = Estado::firstOrCreate(['nombre_estado' => 'Inasistencia']);
        $cita->update(['id_estado' => $estadoInasistencia->id_estado]);

        return response()->json([
            'message' => 'Cita marcada como Inasistencia.',
            'data' => $cita->load(['paciente', 'medico', 'estado'])
        ]);
    }
}
