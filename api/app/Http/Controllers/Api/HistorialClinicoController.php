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
use Barryvdh\DomPDF\Facade\Pdf;

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
        $paciente = Usuario::find($doc);

        if (!$paciente) {
            return response()->json(['status' => 'error', 'message' => 'Paciente no encontrado.'], 404);
        }

        // 2. Todos los detalles de consultas
        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with([
                'cita.medico',
                'cita.especialidad',
                'remisiones.especialidad',
                'remisiones.examen.estado',
                'remisiones.examen.categoriaExamen',
                'remisiones.estado',
                'remisiones.cita.medico',
                'remisiones.cita.especialidad',
                'remisiones.cita.historialDetalle.enfermedades',
                'receta.recetaDetalles.presentacion.medicamento',
                'receta.recetaDetalles.farmacia',
                'receta.estado',
                'enfermedades'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Recopilar remisiones y recetas aplanadas para las tablas
        $citasArr = $detalles->filter(fn($d) => ($d->cita?->tipo_evento ?? 'consulta') === 'consulta')->map(function($d) {
            $enfermedadesStr = $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->join(' | ');
            $diagCompleto = $enfermedadesStr ? "{$enfermedadesStr}\n\nAnálisis Médico:\n{$d->diagnostico}" : $d->diagnostico;

            return [
                'id'          => $d->id_detalle_cita,
                'id_cita'     => $d->id_cita,
                'fecha'       => $d->cita?->fecha,
                'hora'        => $d->cita?->hora_inicio,
                'medico'      => trim(($d->cita?->medico?->primer_nombre ?? '') . ' ' . ($d->cita?->medico?->primer_apellido ?? '')),
                'especialidad'=> $d->cita?->especialidad?->especialidad ?? 'General',
                'diagnostico' => $diagCompleto,
                'tratamiento' => $d->tratamiento,
                'signos'      => $d->signos_vitales,
            ];
        })->values();

        $remisiones = $detalles->flatMap(fn($d) =>
            collect($d->remisiones ?? [])
                ->filter(function($r) {
                    // Si es examen, debe tener resultado PDF o estar en estado Atendida/Finalizada
                    if ($r->tipo_remision === 'examen') {
                        return $r->examen && ($r->examen->resultado_pdf || ($r->examen->estado && $r->examen->estado->nombre_estado === 'Atendida'));
                    }
                    // Si es cita, el resultado (cita) debe tener su propio detalle de atención (HistorialDetalle)
                    if ($r->tipo_remision === 'cita') {
                        return $r->cita && $r->cita->historialDetalle;
                    }
                    return false;
                })
                ->map(fn($r) => [
                    'id'          => $r->id_remision ?? $r->id ?? null,
                    'id_remision' => $r->id_remision,
                    'fecha'       => $r->created_at ? $r->created_at->toDateString() : null,
                    'tipo'        => $r->tipo_remision === 'cita' ? 'Especialista' : 'Examen Clínico',
                    'destino'     => $r->tipo_remision === 'cita'
                                        ? ($r->especialidad?->especialidad ?? 'Sin especialidad')
                                        : ($r->categoriaExamen?->categoria ?? 'Examen'),
                    'estado'      => $r->estado?->nombre_estado ?? 'Atendida',
                    'notas'       => $r->notas ?? '',
                    'raw'         => $r, // Contiene 'cita' que es el resultado
                    'cita_raw'    => $d->cita, // Parent appointment for context (Origen)
                ])
        )->values();

        $recetas = $detalles
            ->filter(fn($d) => $d->receta)
            ->map(fn($d) => [
                'id'               => $d->receta->id_receta,
                'id_receta'        => $d->receta->id_receta,
                'fecha'            => $d->cita?->fecha,
                'estado'           => $d->receta->estado?->nombre_estado ?? 'Pendiente',
                'fecha_vencimiento'=> $d->receta->fecha_vencimiento,
                'resumen'          => collect($d->receta->recetaDetalles ?? [])->take(2)->map(fn($det) => $det->presentacion?->medicamento?->nombre)->join(', ') . ($d->receta->recetaDetalles->count() > 2 ? '...' : ''),
                'raw'              => $d->receta, // Full object with relations
                'cita_raw'         => $d->cita, // Parent appointment for context
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
                'citas'      => $citasArr,
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
            'sexo'                    => 'nullable|in:M,F,Masculino,Femenino,Otro',
            'fecha_nacimiento'        => 'nullable|date',
            'grupo_sanguineo'         => 'nullable|string|max:5',
        ]);

        $historial = HistorialClinico::firstOrCreate(['id_paciente' => $doc]);
        $historial->update($request->only('antecedentes_personales', 'antecedentes_familiares', 'alergias', 'habitos_vida'));

        // Update basic patient information if present
        $usuario = Usuario::find($doc);
        if ($usuario) {
            $usuario->update($request->only('email', 'telefono', 'direccion', 'sexo', 'fecha_nacimiento', 'grupo_sanguineo'));
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

    /**
     * Exportar el historial clínico completo a PDF
     */
    public function exportPdf(string $doc)
    {
        $this->authorizeDoctorForPatient($doc);

        $historial = HistorialClinico::where('id_paciente', $doc)->first();
        $paciente = Usuario::findOrFail($doc);

        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with([
                'cita.medico',
                'cita.especialidad',
                'cita.motivoConsulta',
                'remisiones.especialidad',
                'remisiones.categoriaExamen',
                'remisiones.estado',
                'remisiones.cita.medico',
                'receta.recetaDetalles.presentacion.medicamento',
                'receta.recetaDetalles.presentacion.concentracion',
                'receta.recetaDetalles.presentacion.formaFarmaceutica',
                'receta.recetaDetalles.farmacia',
                'receta.estado',
                'enfermedades'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $citas = $detalles->map(function($d) {
            $enfermedadesStr = $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->join(' | ');
            $diagCompleto = $enfermedadesStr ? "{$enfermedadesStr}\n\nObservaciones:\n{$d->diagnostico}" : $d->diagnostico;

            return (object) [
                'id'          => $d->cita?->id_cita ?? $d->id_detalle_cita,
                'fecha'       => $d->cita?->fecha,
                'hora'        => $d->cita?->hora_inicio ? substr($d->cita->hora_inicio, 0, 5) : null,
                'id_medico'   => $d->cita?->doc_medico,
                'medico'      => trim(($d->cita?->medico?->primer_nombre ?? '') . ' ' . ($d->cita?->medico?->primer_apellido ?? '')),
                'especialidad'=> $d->cita?->especialidad?->especialidad ?? 'General',
                'motivo'      => $d->cita?->motivoConsulta?->motivo ?? 'Consulta General',
                'diagnostico' => $diagCompleto,
            ];
        });

        $remisiones = $detalles->flatMap(function($d) {
            $medicoName = trim(($d->cita?->medico?->primer_nombre ?? '') . ' ' . ($d->cita?->medico?->primer_apellido ?? ''));
            $motivoCita = $d->cita?->motivoConsulta?->motivo ?? 'Consulta General';
            
            return collect($d->remisiones ?? [])->map(fn($r) => (object) [
                'id'                 => $r->id_remision ?? $r->id ?? null,
                'fecha'              => $r->created_at ? $r->created_at->format('d/m/Y') : null,
                'tipo'               => $r->tipo_remision === 'cita' ? 'Especialista' : 'Examen Médico',
                'destino'            => $r->tipo_remision === 'cita'
                                            ? ($r->especialidad?->especialidad ?? 'Sin especialidad')
                                            : ($r->categoriaExamen?->categoria ?? 'Examen General'),
                'estado'             => $r->estado?->nombre_estado ?? 'Activa',
                'medico_solicitante' => $medicoName,
                'motivo_solicitud'   => $motivoCita,
                'notas'              => $r->notas
            ]);
        })->values();

        $recetas = $detalles
            ->filter(fn($d) => $d->receta)
            ->map(fn($d) => (object) [
                'id'               => $d->receta->id_receta,
                'fecha'            => $d->cita?->fecha,
                'fecha_vencimiento'=> $d->receta->fecha_vencimiento,
                'medicamentos'     => collect($d->receta->recetaDetalles ?? [])->map(fn($det) => (object) [
                    'medicamento' => trim(($det->presentacion?->medicamento?->nombre ?? '—') . ' ' . ($det->presentacion?->concentracion?->concentracion ?? '')),
                    'dosis'       => $det->dosis,
                    'frecuencia'  => $det->frecuencia,
                    'duracion'    => $det->duracion ?? $d->receta->fecha_vencimiento,
                ])
            ])->values();

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        // ── Build evolution data ──────────────────────────────────────────
        // Use a separate asc-ordered query for the evolution section
        $detallesEv = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with(['cita', 'enfermedades'])
            ->orderBy('created_at', 'asc')
            ->get();

        // VITALS_LABELS maps field key → display label + unit
        $vitalsLabels = [
            'ta_sistolica'  => ['label' => 'TA Sist.',    'unit' => 'mmHg'],
            'ta_diastolica' => ['label' => 'TA Diast.',   'unit' => 'mmHg'],
            'fc'            => ['label' => 'Frec. Card.', 'unit' => 'lpm'],
            'fr'            => ['label' => 'Frec. Resp.', 'unit' => 'rpm'],
            'temperatura'   => ['label' => 'Temp.',       'unit' => '°C'],
            'peso'          => ['label' => 'Peso',        'unit' => 'kg'],
            'talla'         => ['label' => 'Talla',       'unit' => 'm'],
            'saturacion_o2' => ['label' => 'SpO₂',        'unit' => '%'],
        ];

        $evSignos = $detallesEv
            ->filter(fn($d) => !empty($d->signos_vitales) && $d->cita?->fecha)
            ->map(function ($d) {
                $sv = is_array($d->signos_vitales)
                    ? $d->signos_vitales
                    : json_decode($d->signos_vitales ?? '{}', true);
                return array_merge(['fecha' => $d->cita->fecha], $sv ?? []);
            })
            ->values();

        // Find which vital columns have at least one value
        $activeVitalKeys = collect(array_keys($vitalsLabels))
            ->filter(fn($k) => $evSignos->contains(fn($s) => isset($s[$k]) && $s[$k] !== null))
            ->values();

        $evDiagnostica = $detallesEv
            ->filter(fn($d) => $d->cita?->fecha)
            ->map(fn($d) => (object)[
                'fecha'       => \Carbon\Carbon::parse($d->cita->fecha)->format('d/m/Y'),
                'diagnosticos'=> $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->join(' · '),
                'tratamiento' => $d->tratamiento ?? null,
            ])
            ->values();

        $pdf = Pdf::loadView('pdfs.historial_clinico', compact(
            'historial', 'paciente', 'citas', 'remisiones', 'recetas', 'logoBase64',
            'evSignos', 'evDiagnostica', 'activeVitalKeys', 'vitalsLabels'
        ))->setPaper('a4', 'portrait');

        return $pdf->download("historial_clinico_{$doc}.pdf");
    }

    /**
     * Devuelve los datos de evolución clínica: signos vitales + diagnósticos por fecha.
     */
    public function evolucion(string $doc): JsonResponse
    {
        $this->authorizeDoctorForPatient($doc);

        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with(['cita', 'enfermedades'])
            ->orderBy('created_at', 'asc')
            ->get();

        $signos = $detalles
            ->filter(fn($d) => !empty($d->signos_vitales) && $d->cita?->fecha)
            ->map(function ($d) {
                $sv = is_array($d->signos_vitales)
                    ? $d->signos_vitales
                    : json_decode($d->signos_vitales ?? '{}', true);

                return array_merge(['fecha' => $d->cita->fecha], $sv ?? []);
            })
            ->values();

        $evolucionDiagnostica = $detalles
            ->filter(fn($d) => $d->cita?->fecha)
            ->map(function ($d) {
                return [
                    'fecha'       => $d->cita->fecha,
                    'diagnosticos' => $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->values(),
                    'tratamiento' => $d->tratamiento ?? null,
                    'diagnostico_texto' => $d->diagnostico ?? null,
                ];
            })
            ->values();

        $primeraCita = $signos->first();
        $primeraCitaFecha = $primeraCita ? ($primeraCita['fecha'] ?? null) : null;
        
        if (!$primeraCitaFecha) {
            $primeraEv = $evolucionDiagnostica->first();
            $primeraCitaFecha = $primeraEv ? ($primeraEv['fecha'] ?? null) : null;
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'primera_cita'        => $primeraCitaFecha,
                'signos_vitales'      => $signos,
                'evolucion_diagnostica' => $evolucionDiagnostica,
            ],
        ]);
    }

    /**
     * Exportar solo la evolución clínica a PDF.
     * Recibe las gráficas como imágenes base64 desde el frontend (capturas de Recharts).
     */
    public function exportEvolucionPdf(\Illuminate\Http\Request $request, string $doc)
    {
        $this->authorizeDoctorForPatient($doc);

        $paciente = Usuario::findOrFail($doc);

        $detalles = HistorialDetalle::whereHas('historial', fn($q) => $q->where('id_paciente', $doc))
            ->with(['cita', 'enfermedades'])
            ->orderBy('created_at', 'asc')
            ->get();

        $evolucionDiagnostica = $detalles
            ->filter(fn($d) => $d->cita?->fecha)
            ->map(function ($d) {
                return (object) [
                    'fecha'       => \Carbon\Carbon::parse($d->cita->fecha)->format('d/m/Y'),
                    'diagnosticos' => $d->enfermedades->map(fn($e) => "[{$e->codigo_icd}] {$e->nombre}")->join(' · '),
                    'tratamiento' => $d->tratamiento ?? 'Sin registrar',
                ];
            })
            ->values();

        // Imágenes de gráficas capturadas por el frontend
        $graficasBase64 = $request->input('graficas', []);

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {}

        $pdf = Pdf::loadView('pdfs.evolucion_clinica', compact('paciente', 'evolucionDiagnostica', 'graficasBase64', 'logoBase64'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("evolucion_clinica_{$doc}.pdf");
    }
}
