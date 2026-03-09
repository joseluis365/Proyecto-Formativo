<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AtencionMedicaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'notas_medicas' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'remisiones' => 'nullable|array',
            'remisiones.*.tipo_remision' => 'required|string|in:cita,examen',
            'remisiones.*.id_especialidad' => 'nullable|exists:especialidad,id_especialidad',
            'remisiones.*.id_examen' => 'nullable|exists:examen,id_examen',
            'remisiones.*.id_prioridad' => 'nullable|exists:prioridad,id_prioridad',
            'remisiones.*.notas' => 'required|string',
        ];
    }
}
