<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Estado;
use App\Models\HistorialClinico;
use App\Models\HistorialDetalle;
use App\Models\Remision;
use App\Http\Requests\AtencionMedicaRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AtencionMedicaController extends Controller
{
    /**
     * Registra la atención médica de una cita.
     *
     * Flujo seguro:
     *  0. Cargar cita con relaciones e historialDetalle para guardia de idempotencia
     *  1. Guardia 1 — Idempotencia: cita ya atendida
     *  2. Guardia 2 — Autorización: solo el médico asignado puede atender
     *  3. Guardia 3 — Estado "Atendida" resuelto dinámicamente (sin firstOrCreate)
     *  4. Estado "Activa" para remisiones resuelto dinámicamente (sin hardcode)
     *  5. DB::transaction:
     *       5a. firstOrCreate del historial_clinico del paciente
     *       5b. Crear historial_detalle con campos SOAP
     *       5c. Crear remisiones (opcionales, con estado dinámico)
     *       5d. Cambiar estado de la cita a "Atendida"
     *  6. Devolver respuesta con relaciones cargadas
     *
     * POST /api/cita/{id}/atender
     */
    public function atender(AtencionMedicaRequest $request, int $id): JsonResponse
    {
        // ── Carga previa con relaciones necesarias para las guardias ──────────
        $cita = Cita::with(['historialDetalle', 'estado', 'paciente', 'medico'])->findOrFail($id);

        // ── GUARDIA 1: Idempotencia ───────────────────────────────────────────
        // Una cita solo puede tener un historial_detalle (reforzado también por
        // la constraint UNIQUE(id_cita) en la tabla historial_detalle).
        if ($cita->historialDetalle !== null) {
            return response()->json([
                'message' => 'Esta cita ya fue atendida. No se puede registrar una segunda atención.',
            ], 422);
        }

        // ── GUARDIA 2: Autorización — solo el médico asignado ─────────────────
        // El auth()->user() es el médico que está intentando atender.
        /** @var \App\Models\Usuario $medicoAutenticado */
        $medicoAutenticado = \Illuminate\Support\Facades\Auth::user();
        if ((string) $cita->doc_medico !== (string) $medicoAutenticado->documento) {
            return response()->json([
                'message' => 'No autorizado. Solo el médico asignado a esta cita puede registrar la atención.',
            ], 403);
        }

        // ── GUARDIA 3: Resolver estados dinámicamente (FirstOrCreate) ──
        $estadoAtendida = Estado::firstOrCreate(['nombre_estado' => 'Atendida']);

        // Estado "Activa" para remisiones — resuelto una vez fuera de la transacción
        $estadoActivaId = Estado::firstOrCreate(['nombre_estado' => 'Activa'])->id_estado;

        // Estado "Pendiente" para recetas
        $estadoPendienteId = Estado::firstOrCreate(['nombre_estado' => 'Pendiente'])->id_estado;

        // ── TRANSACCIÓN — todo o nada ─────────────────────────────────────────
        $responseData = DB::transaction(function () use ($cita, $request, $estadoAtendida, $estadoActivaId, $estadoPendienteId) {

            // ── 1. Historial clínico del paciente (uno por paciente) ──────────
            // firstOrCreate es correcto aquí: si ya tiene historial lo reutiliza,
            // si no lo tiene lo crea. Los antecedentes personales/familiares
            // se gestionan desde otro módulo (perfil del paciente).
            $historial = HistorialClinico::firstOrCreate([
                'id_paciente' => $cita->doc_paciente,
            ]);

            // ── 2. Detalle SOAP de la atención ───────────────────────────────
            $detalle = HistorialDetalle::create([
                'id_historial'  => $historial->id_historial,
                'id_cita'       => $cita->id_cita,
                // SOAP S — lo que el paciente relata
                'subjetivo'     => $request->subjetivo,
                // SOAP O — signos vitales (cast a array en el modelo → guarda como JSONB)
                'signos_vitales' => $request->signos_vitales,
                // SOAP A — diagnóstico médico
                'diagnostico'   => $request->diagnostico,
                // SOAP P — plan de tratamiento
                'tratamiento'   => $request->tratamiento,
                // Campos originales mantenidos
                'notas_medicas' => $request->notas_medicas,
                'observaciones' => $request->observaciones,
            ]);

            // ── 3. Remisiones — opcionales y Citas futuras ────────────────────
            // Ahora si nacen con fecha, deben ser Agendadas para aparecer en las agendas.
            $estadoAgendada = Estado::firstOrCreate(['nombre_estado' => 'Agendada']);

            // ── 3.1.5 Asociar Enfermedades (CIE-11) ──────────────────────────────
            if (!empty($request->enfermedades)) {
                $detalle->enfermedades()->sync($request->enfermedades);
            }

            // ── 3.2 Remisiones ────────────────────────────────────────────────
            foreach ($request->remisiones ?? [] as $remData) {
                // Generar Cita o Examen a futuro para que el paciente las pueda agendar o gestionar
                $horaInicio = \Carbon\Carbon::createFromFormat('H:i', $remData['hora_inicio']);
                $horaFin = $horaInicio->copy()->addMinutes(30)->format('H:i');

                $idCitaRecienCreada = null;
                $idExamen = null;

                if ($remData['tipo_remision'] === 'cita') {
                    $nuevaCita = Cita::create([
                        'doc_paciente' => $cita->doc_paciente,
                        'tipo_evento' => 'remision',
                        'doc_medico' => $remData['doc_medico'] ?? null,
                        'id_especialidad' => $remData['id_especialidad'] ?? null,
                        'fecha' => $remData['fecha'],
                        'hora_inicio' => $remData['hora_inicio'],
                        'id_estado' => $estadoAgendada->id_estado,
                        'id_motivo' => $remData['id_motivo'] ?? null,
                        'motivo' => !empty($remData['notas']) ? substr($remData['notas'], 0, 255) : null,
                    ]);
                    $idCitaRecienCreada = $nuevaCita->id_cita;
                } else if ($remData['tipo_remision'] === 'examen') {
                    $examen = \App\Models\Examen::create([
                        'nombre' => 'Examen Remitido',
                        'id_categoria_examen' => $remData['id_categoria_examen'] ?? null,
                        'requiere_ayuno' => $remData['requiere_ayuno'] ?? false,
                        'descripcion' => $remData['notas'],
                        'doc_paciente' => $cita->doc_paciente,
                        'fecha' => $remData['fecha'],
                        'hora_inicio' => $remData['hora_inicio'],
                        'hora_fin' => $horaFin,
                        'id_estado' => $estadoAgendada->id_estado,
                    ]);
                    $idExamen = $examen->id_examen;
                }

                Remision::create([
                    'id_detalle_cita' => $detalle->id_detalle,
                    'id_cita'         => $idCitaRecienCreada, 
                    'id_examen'       => $idExamen,
                    'tipo_remision'   => $remData['tipo_remision'],
                    'id_especialidad' => $remData['id_especialidad'] ?? null,
                    'id_categoria_examen' => $remData['id_categoria_examen'] ?? null,
                    'requiere_ayuno'      => $remData['requiere_ayuno'] ?? false,
                    'id_prioridad'    => $remData['id_prioridad'] ?? null,
                    'notas'           => $remData['notas'] ?? null,
                    'id_estado'       => $estadoActivaId,
                ]);
            }

            // ── 3.5 Recetas ───────────────────────────────────────────────────
            if (!empty($request->recetas)) {
                $receta = \App\Models\Receta::create([
                    'id_detalle_cita'   => $detalle->id_detalle,
                    'fecha_vencimiento' => \Carbon\Carbon::now()->addDays(30)->toDateString(),
                    'id_estado'         => $estadoPendienteId
                ]);

                foreach ($request->recetas as $recetaData) {
                    $inventario = \App\Models\InventarioFarmacia::where('id_presentacion', $recetaData['id_presentacion'])
                        ->where('nit_farmacia', $recetaData['nit_farmacia'])
                        ->lockForUpdate()
                        ->first();

                    if (!$inventario || $inventario->stock_actual < $recetaData['cantidad_dispensar']) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'receta' => "No hay stock suficiente para uno o más medicamentos en la farmacia seleccionada."
                        ]);
                    }

                    $inventario->decrement('stock_actual', $recetaData['cantidad_dispensar']);

                    \App\Models\RecetaDetalle::create([
                        'id_receta'          => $receta->id_receta,
                        'id_presentacion'    => $recetaData['id_presentacion'],
                        'cantidad_dispensar' => $recetaData['cantidad_dispensar'],
                        'dosis'              => $recetaData['dosis'],
                        'frecuencia'         => $recetaData['frecuencia'],
                        'duracion'           => $recetaData['duracion'],
                        'observaciones'      => $recetaData['observaciones'] ?? null,
                        'nit_farmacia'       => $recetaData['nit_farmacia']
                    ]);
                }
            }

            // ── 4. Cambiar estado de la cita a "Atendida" ────────────────────
            $cita->update(['id_estado' => $estadoAtendida->id_estado]);

            $detalle->load(
                'remisiones.especialidad', 
                'remisiones.examen', 
                'remisiones.prioridad',
                'receta.recetaDetalles.presentacion',
                'enfermedades'
            );

            return [
                'historial'  => [
                    'id_historial' => $historial->id_historial,
                    'id_paciente'  => $historial->id_paciente,
                ],
                'detalle'    => $detalle,
                'remisiones' => $detalle->remisiones,
                'receta'     => $detalle->receta,
                'cita_id'    => $cita->id_cita,
                'estado'     => $estadoAtendida->nombre_estado,
                'paciente'   => $cita->paciente,
            ];
        });

        // ── 6. Enviar Correo de Notificación (Fuera de la DB Transaction) ──────
        try {
            if ($cita->paciente && $cita->paciente->email) {
                \Illuminate\Support\Facades\Mail::to($cita->paciente->email)
                    ->send(new \App\Mail\ConsultaFinalizadaMail(
                        $cita, 
                        $responseData['detalle'], 
                        $responseData['remisiones'], 
                        $responseData['receta']
                    ));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Correo fallido en cita #{$cita->id_cita}: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Atención médica registrada correctamente.',
            'data'    => $responseData,
        ]);
    }
}
