<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistorialClinico;
use App\Models\HistorialDetalle;
use App\Models\Receta;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Constants\RolConstants;


class HistorialClinicoController extends Controller
{
    /**
     * Valida que el médico autenticado tenga permiso para ver/editar al paciente.
     */
    private function authorizeDoctorForPatient(string $docPaciente): void
    {
        /** @var \App\Models\Usuario $user */
        $user = Auth::user();

        if (!$user) {
            abort(401, 'Usuario no autenticado.');
        }

        $idRol = (int)$user->id_rol;
        $documentoUsuario = (string)$user->documento;

        Log::info("Autorizando acceso a historial", [
            'user_id' => $documentoUsuario,
            'user_rol' => $idRol,
            'target_paciente' => $docPaciente
        ]);

        // 1. El propio paciente puede ver su historial
        if ($documentoUsuario === (string)$docPaciente) return;

        // 2. Super Admin (1), Admin (2) y Personal Administrativo (3) tienen acceso total
        if (in_array($idRol, [
            RolConstants::SUPER_ADMIN,
            RolConstants::ADMIN,
            RolConstants::PERSONAL_ADMINISTRATIVO
        ])) {
            return;
        }

        // 3. El médico asignado (se asume que si es médico puede ver historiales, 
        //    pero aquí podrías restringir a 'solo sus pacientes' si fuera necesario)
        if ($idRol === RolConstants::MEDICO) {
            return;
        }

        abort(403, 'ADM: No tienes autorización para acceder al historial de este paciente.');
    }

    /**
     * Resumen del historial clínico (antecedentes).
     */
    public function show(string $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $historial = HistorialClinico::with('paciente')
            ->where('id_paciente', $doc)
            ->first();

        return response()->json([
            'status'  => 'success',
            'data'    => $historial,
            'message' => $historial ? null : 'Sin historial creado todavía.',
        ]);
    }

    /**
     * Lista últimas 10 atenciones (detalles) del paciente.
     */
    public function detalles(string $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with(['cita.medico', 'cita.especialidad', 'remisiones.especialidad', 'receta.recetaDetalles.presentacion.medicamento', 'enfermedades'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json(['status' => 'success', 'data' => $detalles]);
    }

    /**
     * Historial completo: datos del paciente + antecedentes + citas + remisiones + recetas.
     * Soporta filtros por sección vía query string.
     */
    public function completo(string $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        // 1. Historial base (antecedentes)
        $historial = HistorialClinico::where('id_paciente', $doc)->first();

        // 1.5 Cargar datos básicos del paciente (siempre requerido, incluso si no hay historial)
        $paciente = Usuario::where('documento', $doc)->first();

        if (!$paciente) {
            return response()->json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        // 2. Todos los detalles de consultas
        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with([
                'cita.medico',
                'cita.especialidad',
                'remisiones.especialidad',
                'remisiones.estado',
                'receta.recetaDetalles.presentacion.medicamento',
                'receta.recetaDetalles.farmacia',
                'receta.estado',
                'enfermedades'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Recopilar remisiones y recetas aplanadas para las tablas
        $citas = $detalles->map(function($d) {
            $enfermedadesStr = $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->join(' | ');
            $diagCompleto = $enfermedadesStr ? "{$enfermedadesStr}\n\nAnálisis Médico:\n{$d->diagnostico}" : $d->diagnostico;

            return [
                'id'          => $d->id_detalle_cita,
                'fecha'       => $d->cita?->fecha,
                'hora'        => $d->cita?->hora_inicio,
                'medico'      => trim(($d->cita?->medico?->primer_nombre ?? '') . ' ' . ($d->cita?->medico?->primer_apellido ?? '')),
                'especialidad'=> $d->cita?->especialidad?->especialidad ?? 'General',
                'diagnostico' => $diagCompleto,
                'tratamiento' => $d->tratamiento,
                'signos'      => $d->signos_vitales,
            ];
        });

        $remisiones = $detalles->flatMap(fn($d) =>
            collect($d->remisiones ?? [])->map(fn($r) => [
                'id'          => $r->id_remision ?? $r->id ?? null,
                'fecha'       => $r->created_at ? $r->created_at->toDateString() : null,
                'tipo'        => $r->tipo_remision === 'cita' ? 'Especialista' : 'Examen Clínico',
                'descripcion' => $r->tipo_remision === 'cita'
                                    ? ($r->especialidad?->especialidad ?? 'Sin especialidad')
                                    : ($r->id_examen ?? 'Sin especificar'),
                'estado'      => $r->estado?->nombre_estado ?? 'Activa',
                'notas'       => $r->notas ?? '',
            ])
        )->values();

        $recetas = $detalles
            ->filter(fn($d) => $d->receta)
            ->map(fn($d) => [
                'id'               => $d->receta->id_receta,
                'fecha'            => $d->cita?->fecha,
                'estado'           => $d->receta->estado?->nombre_estado ?? 'Pendiente',
                'fecha_vencimiento'=> $d->receta->fecha_vencimiento,
                'medicamentos'     => collect($d->receta->recetaDetalles ?? [])->map(fn($det) => [
                    'medicamento' => $det->presentacion?->medicamento?->nombre ?? '—',
                    'dosis'       => $det->dosis,
                    'frecuencia'  => $det->frecuencia,
                    'farmacia'    => $det->farmacia?->nombre ?? $det->nit_farmacia,
                ])->values()->toArray(),
            ])->values();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'historial'  => $historial,
                'paciente'   => $paciente,
                'citas'      => $citas,
                'remisiones' => $remisiones,
                'recetas'    => $recetas,
            ],
        ]);
    }

    /**
     * Actualizar antecedentes, alergias y hábitos del historial.
     */
    public function updateAntecedentes(Request $request, string $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $validated = $request->validate([
            'antecedentes_personales' => 'nullable|string|max:5000',
            'antecedentes_familiares' => 'nullable|string|max:5000',
            'alergias'                => 'nullable|string|max:3000',
            'habitos_vida'            => 'nullable|array',
            'habitos_vida.*'          => 'nullable|string|max:500',
            // Datos demográficos del usuario
            'email'                   => 'nullable|email|max:150',
            'telefono'                => 'nullable|string|max:20',
            'direccion'               => 'nullable|string|max:255',
            'genero'                  => 'nullable|in:M,F,Otro',
            'fecha_nacimiento'        => 'nullable|date',
            'grupo_sanguineo'         => 'nullable|string|max:5',
        ]);

        $historial = HistorialClinico::firstOrCreate(['id_paciente' => $doc]);
        $historial->update($request->only('antecedentes_personales', 'antecedentes_familiares', 'alergias', 'habitos_vida'));

        // Update basic patient information if present
        $usuario = Usuario::where('documento', $doc)->first();
        if ($usuario) {
            $usuario->update($request->only('email', 'telefono', 'direccion', 'genero', 'fecha_nacimiento', 'grupo_sanguineo'));
        }

        // Reload the patient relation to return the updated demographic data
        $historial->load('paciente');

        return response()->json([
            'status'  => 'success',
            'message' => 'Historial y datos del paciente actualizados correctamente.',
            'data'    => $historial,
        ]);
    }

    /**
     * Lista todos los pacientes únicos del médico autenticado.
     */
    public function misPacientes(): JsonResponse
    {
        /** @var \App\Models\Usuario $user */
        $user = Auth::user();
        $medicoId = $user->documento;

        $pacientes = HistorialDetalle::whereHas('cita', fn($q) => $q->where('doc_medico', $medicoId))
            ->with('historial.paciente')
            ->get()
            ->pluck('historial.paciente')
            ->unique('documento')
            ->values();

        return response()->json(['status' => 'success', 'data' => $pacientes]);
    }
}
