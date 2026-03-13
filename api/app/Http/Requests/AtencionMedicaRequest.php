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
            'diagnostico'     => 'required|string|max:3000',

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
            'diagnostico.required'        => 'El diagnóstico es obligatorio.',
            'tratamiento.required'        => 'El tratamiento es obligatorio.',
            'remisiones.*.tipo_remision.in' => 'El tipo de remisión debe ser "cita" o "examen".',
            'remisiones.*.notas.required' => 'Las notas de remisión son obligatorias.',
        ];
    }
}
