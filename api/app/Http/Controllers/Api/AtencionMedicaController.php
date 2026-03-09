<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\HistorialClinico;
use App\Models\HistorialDetalle;
use App\Models\Remision;
use App\Models\Estado;
use App\Http\Requests\AtencionMedicaRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AtencionMedicaController extends Controller
{
    /**
     * Registra la atención médica de una cita.
     */
    public function atender(AtencionMedicaRequest $request, int $id): JsonResponse
    {
        $cita = Cita::findOrFail($id);

        return DB::transaction(function () use ($cita, $request) {
            // 1. Buscar o crear el Historial Clínico del paciente
            $historial = HistorialClinico::firstOrCreate(
                ['id_paciente' => $cita->doc_paciente]
            );

            // 2. Crear el detalle de la atención
            $detalle = HistorialDetalle::create([
                'id_historial' => $historial->id_historial,
                'id_cita' => $cita->id_cita,
                'diagnostico' => $request->diagnostico,
                'tratamiento' => $request->tratamiento,
                'notas_medicas' => $request->notas_medicas,
                'observaciones' => $request->observaciones,
            ]);

            // 3. Crear remisiones si existen
            if ($request->has('remisiones') && is_array($request->remisiones)) {
                foreach ($request->remisiones as $remData) {
                    Remision::create([
                        'id_detalle_cita' => $detalle->id_detalle,
                        'tipo_remision' => $remData['tipo_remision'],
                        'id_especialidad' => $remData['id_especialidad'] ?? null,
                        'id_examen' => $remData['id_examen'] ?? null,
                        'id_prioridad' => $remData['id_prioridad'] ?? null,
                        'notas' => $remData['notas'],
                        'id_estado' => 1, // Por defecto 'Activa' para la remisión
                    ]);
                }
            }

            // 4. Actualizar estado de la cita a 'Atendida'
            // Buscamos el ID del estado 'Atendida' o lo creamos si no existe
            $estadoAtendida = Estado::firstOrCreate(['nombre_estado' => 'Atendida']);
            $cita->update(['id_estado' => $estadoAtendida->id_estado]);

            return response()->json([
                'message' => 'Atención médica registrada correctamente',
                'data' => [
                    'historial_id' => $historial->id_historial,
                    'detalle_id' => $detalle->id_detalle,
                    'cita_id' => $cita->id_cita
                ]
            ]);
        });
    }
}
