<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Examen;
use App\Models\Receta;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificacionPacienteController extends Controller
{
    /**
     * Obtiene las alertas de citas, exámenes y recetas para el paciente.
     */
    public function getAlertas(Request $request)
    {
        $user = $request->user();

        // Validar que sea un paciente (Rol ID 5)
        if ($user->id_rol !== 5) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los pacientes pueden acceder a estas notificaciones.'
            ], 403);
        }

        $hoy = Carbon::now()->toDateString();
        $manana = Carbon::now()->addDay()->toDateString();

        // 1. Citas próximas (General o Especialidad)
        $citas = Cita::with(['medico', 'especialidad', 'motivoConsulta'])
            ->where('doc_paciente', $user->documento)
            ->where('id_estado', 9) // Agendada
            ->whereBetween('fecha', [$hoy, $manana])
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->map(function ($cita) {
                return [
                    'id' => $cita->id_cita,
                    'tipo' => 'cita',
                    'titulo' => $cita->especialidad ? "Cita de {$cita->especialidad->nombre}" : "Cita Médica",
                    'descripcion' => "Tienes una cita con el Dr. " . ($cita->medico ? $cita->medico->primer_nombre . ' ' . $cita->medico->primer_apellido : 'N/A'),
                    'fecha' => $cita->fecha,
                    'hora' => substr($cita->hora_inicio, 0, 5),
                    'color' => 'blue',
                    'icon' => 'calendar_month',
                    'link' => '/paciente/citas'
                ];
            });

        // 2. Exámenes próximos
        $examenes = Examen::with(['categoriaExamen'])
            ->where('doc_paciente', $user->documento)
            ->where('id_estado', 9) // Agendada
            ->whereBetween('fecha', [$hoy, $manana])
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->map(function ($examen) {
                return [
                    'id' => $examen->id_examen,
                    'tipo' => 'examen',
                    'titulo' => "Examen: {$examen->nombre}",
                    'descripcion' => ($examen->requiere_ayuno ? "Requiere ayuno. " : "") . ($examen->categoriaExamen ? "Categoría: {$examen->categoriaExamen->nombre}" : ""),
                    'fecha' => $examen->fecha,
                    'hora' => substr($examen->hora_inicio, 0, 5),
                    'color' => 'indigo',
                    'icon' => 'science',
                    'link' => '/paciente/citas' // Asumiendo que se ven en la misma vista o una similar
                ];
            });

        // 3. Recetas pendientes
        $recetas = Receta::where('id_estado', 13) // Pendiente
            ->whereHas('historialDetalle.cita', function ($q) use ($user) {
                $q->where('doc_paciente', $user->documento);
            })
            ->with(['historialDetalle.cita.medico'])
            ->latest()
            ->get()
            ->map(function ($receta) {
                $fechaPrescripcion = $receta->created_at->format('Y-m-d');
                return [
                    'id' => $receta->id_receta,
                    'tipo' => 'receta',
                    'titulo' => "Receta Pendiente",
                    'descripcion' => "Tienes medicamentos pendientes por reclamar de tu consulta del {$fechaPrescripcion}.",
                    'fecha' => $receta->fecha_vencimiento, // Usamos fecha de vencimiento si existe
                    'color' => 'orange',
                    'icon' => 'medication',
                    'link' => '/paciente/medicamentos'
                ];
            });

        // Combinar todas las alertas
        $alertas = $citas->concat($examenes)->concat($recetas);

        return response()->json([
            'success' => true,
            'data' => $alertas
        ]);
    }
}
