<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AtencionMedicaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autorización de médico asignado se valida en el controlador
    }

    public function rules(): array
    {
        return [
            // ── SOAP S — Subjetivo (anamnesis del paciente) ───────────────────
            'subjetivo'       => 'nullable|string|max:3000',

            // ── SOAP O — Objetivo: signos vitales (JSON) ──────────────────────
            'signos_vitales'                   => 'nullable|array',
            'signos_vitales.ta_sistolica'      => 'nullable|numeric|between:70,250',
            'signos_vitales.ta_diastolica'     => 'nullable|numeric|between:40,150',
            'signos_vitales.fc'                => 'nullable|numeric|between:30,220',
            'signos_vitales.fr'                => 'nullable|numeric|between:8,60',
            'signos_vitales.temperatura'       => 'nullable|numeric|between:30,45',
            'signos_vitales.peso'              => 'nullable|numeric|between:1,400',
            'signos_vitales.talla'             => 'nullable|numeric|between:0.3,2.5',
            'signos_vitales.saturacion_o2'     => 'nullable|numeric|between:50,100',

            // ── SOAP A — Análisis/Diagnóstico ─────────────────────────────────
            'diagnostico'     => 'nullable|string|max:3000',
            'enfermedades'    => 'required|array|min:1|max:15',
            'enfermedades.*'  => 'required|string|distinct|exists:enfermedades,codigo_icd',

            // ── SOAP P — Plan / Tratamiento ───────────────────────────────────
            'tratamiento'     => 'required|string|max:3000',

            // Campos existentes — se mantienen
            'notas_medicas'   => 'nullable|string|max:3000',
            'observaciones'   => 'nullable|string|max:3000',

            // ── Remisiones — opcionales ───────────────────────────────────────
            'remisiones'                       => ['nullable', 'array'],
            'remisiones.*.tipo_remision'       => 'required_with:remisiones|string|in:cita,examen',
            'remisiones.*.id_especialidad'     => [
                'nullable',
                Rule::exists('especialidad', 'id_especialidad'),
            ],
            'remisiones.*.id_examen'           => [
                'nullable',
                Rule::exists('examen', 'id_examen'),
            ],
            'remisiones.*.id_prioridad'        => 'nullable|exists:prioridad,id_prioridad',
            'remisiones.*.notas'               => 'required_with:remisiones|string|max:1000',
            'remisiones.*.fecha'               => 'required_with:remisiones|date|after_or_equal:today',
            'remisiones.*.hora_inicio'         => 'required_with:remisiones|date_format:H:i',
            'remisiones.*.doc_medico'          => 'nullable|exists:usuario,documento',

            // ── Recetas / Medicamentos — opcionales ───────────────────────────
            'recetas'                          => ['nullable', 'array'],
            'recetas.*.id_presentacion'        => 'required_with:recetas|exists:presentacion_medicamento,id_presentacion',
            'recetas.*.cantidad_dispensar'     => 'required_with:recetas|integer|min:1',
            'recetas.*.dosis'                  => 'required_with:recetas|string|max:100',
            'recetas.*.frecuencia'             => 'required_with:recetas|string|max:100',
            'recetas.*.duracion'               => 'required_with:recetas|string|max:100',
            'recetas.*.observaciones'          => 'nullable|string|max:1000',
            'recetas.*.nit_farmacia'           => 'required_with:recetas|string|max:20|exists:farmacia,nit',
        ];
    }

    /**
     * Validación semántica adicional:
     * - tipo_remision='cita'   → id_especialidad requerido
     * - tipo_remision='examen' → id_examen requerido
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            foreach ($this->remisiones ?? [] as $i => $rem) {
                $tipo = $rem['tipo_remision'] ?? '';

                if ($tipo === 'cita' && empty($rem['id_especialidad'])) {
                    $v->errors()->add(
                        "remisiones.{$i}.id_especialidad",
                        'La especialidad destino es obligatoria para remisión de tipo "cita".'
                    );
                }

                if ($tipo === 'cita' && empty($rem['doc_medico'])) {
                    $v->errors()->add(
                        "remisiones.{$i}.doc_medico",
                        'El médico especialista es obligatorio para remisión de tipo "cita".'
                    );
                }

                if ($tipo === 'examen' && empty($rem['id_examen'])) {
                    $v->errors()->add(
                        "remisiones.{$i}.id_examen",
                        'El examen es obligatorio para remisión de tipo "examen".'
                    );
                }

                // Check collisions and time logic for all events
                if (!empty($rem['hora_inicio']) && !empty($rem['fecha'])) {
                    $hora = \Carbon\Carbon::createFromFormat('H:i', $rem['hora_inicio']);
                    $inicioMinimo = \Carbon\Carbon::createFromFormat('H:i', '08:00');
                    $inicioMaximo = \Carbon\Carbon::createFromFormat('H:i', '17:00');

                    if ($hora->lt($inicioMinimo) || $hora->gt($inicioMaximo)) {
                        $v->errors()->add("remisiones.{$i}.hora_inicio", 'El horario de inicio debe estar entre las 08:00 y las 17:00.');
                    }

                    if (!in_array($hora->minute, [0, 30])) {
                        $v->errors()->add("remisiones.{$i}.hora_inicio", 'Las citas solo pueden programarse en intervalos de 30 minutos (ej. :00 o :30).');
                    }

                    // Check colisions for doctor if provided
                    if (!empty($rem['doc_medico'])) {
                        $exists = \App\Models\Cita::where('doc_medico', $rem['doc_medico'])
                            ->where('fecha', $rem['fecha'])
                            ->where('hora_inicio', $rem['hora_inicio'] . ':00')
                            ->where('id_estado', '!=', \App\Models\Estado::where('nombre_estado', 'Cancelada')->value('id_estado'))
                            ->exists();

                        if ($exists) {
                            $v->errors()->add("remisiones.{$i}.hora_inicio", 'El médico ya tiene una cita en ese horario.');
                        }
                    }
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'diagnostico.required'         => 'El análisis clínico (diagnóstico) es obligatorio.',
            'diagnostico.max'              => 'El análisis clínico no debe exceder los 3000 caracteres.',

            'enfermedades.required'        => 'Debe diagnosticar al menos una (1) enfermedad (CIE-11).',
            'enfermedades.array'           => 'Formato inválido para las enfermedades.',
            'enfermedades.min'             => 'Debe diagnosticar al menos una (1) enfermedad (CIE-11).',
            'enfermedades.max'             => 'No puede diagnosticar más de 15 enfermedades simultáneamente.',
            'enfermedades.*.exists'        => 'El código CIE-11 seleccionado no es válido o no existe.',
            'enfermedades.*.distinct'      => 'No puede seleccionar la misma enfermedad varias veces.',

            'tratamiento.required'         => 'El plan de tratamiento es obligatorio.',
            'tratamiento.max'              => 'El tratamiento no debe exceder los 3000 caracteres.',
            'remisiones.*.tipo_remision.in' => 'El tipo de remisión debe ser "cita" o "examen".',
            'remisiones.*.notas.required' => 'Las notas de remisión son obligatorias.',
        ];
    }
}
