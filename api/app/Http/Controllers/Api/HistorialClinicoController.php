<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistorialClinico;
use App\Models\HistorialDetalle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HistorialClinicoController extends Controller
{
    /**
     * Valida que el médico autenticado tenga permiso para ver/editar al paciente.
     * Un médico solo puede acceder si tiene al menos una cita (cualquier estado) con el paciente.
     * Los admins se saltan esta validación.
     */
    private function authorizeDoctorForPatient(int $docPaciente): void
    {
        $user = auth()->user();
        
        // El paciente puede ver su propio historial
        if ((string)$user->documento === (string)$docPaciente) return;

        // El SuperAdmin (rol 1) y Admin (rol 2) tienen acceso total (opcional según requerimiento)
        if (in_array($user->id_rol, [1, 2])) return;

        // El médico puede ver cualquier historial según nuevo requerimiento
        if ($user->id_rol === \App\Constants\RolConstants::MEDICO) return;

        abort(403, 'No tienes autorización para acceder al historial de este paciente.');
    }

    /**
     * Muestra el resumen del historial clínico de un paciente.
     */
    public function show(int $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $historial = HistorialClinico::with('paciente')
            ->where('id_paciente', $doc)
            ->first();

        if (!$historial) {
            return response()->json([
                'status' => 'success',
                'data' => null,
                'message' => 'El paciente no tiene un historial clínico creado todavía.'
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $historial
        ]);
    }

    /**
     * Lista los últimos detalles clínicos (atenciones) de un paciente.
     */
    public function detalles(int $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $detalles = HistorialDetalle::whereHas('historial', function ($query) use ($doc) {
                $query->where('id_paciente', $doc);
            })
            ->with(['cita.medico', 'remisiones.especialidad'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $detalles
        ]);
    }

    /**
     * Actualiza los antecedentes personales y familiares del paciente.
     */
    public function updateAntecedentes(Request $request, int $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $request->validate([
            'antecedentes_personales' => 'nullable|string|max:5000',
            'antecedentes_familiares' => 'nullable|string|max:5000',
        ]);

        $historial = HistorialClinico::firstOrCreate(['id_paciente' => $doc]);
        
        $historial->update($request->only([
            'antecedentes_personales', 
            'antecedentes_familiares'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Antecedentes actualizados correctamente.',
            'data' => $historial
        ]);
    }

    /**
     * Lista todos los pacientes únicos que han sido atendidos por el médico autenticado.
     */
    public function misPacientes(): JsonResponse
    {
        $medicoId = auth()->user()->documento;

        $pacientes = HistorialDetalle::whereHas('cita', function($q) use ($medicoId) {
                $q->where('doc_medico', $medicoId);
            })
            ->with('historial.paciente')
            ->get()
            ->pluck('historial.paciente')
            ->unique('documento')
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $pacientes
        ]);
    }
}
