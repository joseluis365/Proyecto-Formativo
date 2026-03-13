<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCitaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'doc_paciente' => 'required|string|exists:usuario,documento',
            'doc_medico' => 'required|string|exists:usuario,documento',
            'fecha' => 'required|date|after_or_equal:today',
            'hora_inicio' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    // Validar rango permitido (08:00 - 17:00)
                    $hora = \Carbon\Carbon::createFromFormat('H:i', $value);
                    $inicioMinimo = \Carbon\Carbon::createFromFormat('H:i', '08:00');
                    $inicioMaximo = \Carbon\Carbon::createFromFormat('H:i', '17:00');

                    if ($hora->lt($inicioMinimo) || $hora->gt($inicioMaximo)) {
                        $fail('El horario de inicio debe estar entre las 08:00 y las 17:00.');
                    }

                    // Validar que los minutos sean 00 o 30
                    if (!in_array($hora->minute, [0, 30])) {
                        $fail('Las citas solo pueden programarse en intervalos de 30 minutos (ej. :00 o :30).');
                    }

                    // Validar colisiones
                    $exists = \App\Models\Cita::where('doc_medico', $this->doc_medico)
                        ->where('fecha', $this->fecha)
                        ->where('hora_inicio', $value . ':00')
                        ->where('id_estado', '!=', \App\Models\Estado::where('nombre_estado', 'Cancelada')->value('id_estado')) // No cancelada
                        ->exists();

                    if ($exists) {
                        $fail('El médico ya tiene una cita en ese horario.');
                    }
                }
            ],
            'motivo' => 'required|string|max:255',
            'id_tipo_cita' => 'required|integer|exists:tipo_cita,id_tipo_cita',
        ];
    }
}
