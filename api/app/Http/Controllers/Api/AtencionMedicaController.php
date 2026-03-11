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
        $cita = Cita::with(['historialDetalle', 'estado'])->findOrFail($id);

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
        $medicoAutenticado = auth()->user();
        if ((string) $cita->doc_medico !== (string) $medicoAutenticado->documento) {
            return response()->json([
                'message' => 'No autorizado. Solo el médico asignado a esta cita puede registrar la atención.',
            ], 403);
        }

        // ── GUARDIA 3: Resolver estados dinámicamente (sin hardcode ni firstOrCreate) ──
        $estadoAtendida = Estado::where('nombre_estado', 'Atendida')->first();
        if (! $estadoAtendida) {
            return response()->json([
                'message' => 'Estado "Atendida" no encontrado. Ejecute EstadoSeeder.',
            ], 500);
        }

        // Estado "Activa" para remisiones — resuelto una vez fuera de la transacción
        $estadoActivaId = Estado::where('nombre_estado', 'Activa')->value('id_estado');

        // ── TRANSACCIÓN — todo o nada ─────────────────────────────────────────
        return DB::transaction(function () use ($cita, $request, $estadoAtendida, $estadoActivaId) {

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

            // ── 3. Remisiones — opcionales ────────────────────────────────────
            foreach ($request->remisiones ?? [] as $remData) {
                Remision::create([
                    'id_detalle_cita' => $detalle->id_detalle,
                    'tipo_remision'   => $remData['tipo_remision'],
                    'id_especialidad' => $remData['id_especialidad'] ?? null,
                    'id_examen'       => $remData['id_examen'] ?? null,
                    'id_prioridad'    => $remData['id_prioridad'] ?? null,
                    'notas'           => $remData['notas'],
                    // Estado resuelto dinámicamente — sin hardcode
                    'id_estado'       => $estadoActivaId,
                ]);
            }

            // ── 4. Cambiar estado de la cita a "Atendida" ────────────────────
            $cita->update(['id_estado' => $estadoAtendida->id_estado]);

            // ── 5. Respuesta con relaciones cargadas ──────────────────────────
            $detalle->load('remisiones.especialidad', 'remisiones.examen', 'remisiones.prioridad');

            return response()->json([
                'message' => 'Atención médica registrada correctamente.',
                'data'    => [
                    'historial'  => [
                        'id_historial' => $historial->id_historial,
                        'id_paciente'  => $historial->id_paciente,
                    ],
                    'detalle'    => $detalle,
                    'remisiones' => $detalle->remisiones,
                    'cita_id'    => $cita->id_cita,
                    'estado'     => $estadoAtendida->nombre_estado,
                ],
            ]);
        });
    }
}
