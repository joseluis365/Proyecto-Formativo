<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de actualizacion de cita.
 * Valida cambios permitidos sobre una cita existente.
 */
class UpdateCitaRequest extends FormRequest
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
            'doc_paciente' => 'sometimes|string|exists:usuario,documento',
            'doc_medico' => 'sometimes|string|exists:usuario,documento',
            'fecha' => 'sometimes|date',
            'hora_inicio' => [
                'nullable',
                'date_format:H:i:s',
                function ($attribute, $value, $fail) {
                    // Si no mandan fecha en la actualización, asumimos que no necesitamos validar colisión tan profunda 
                    // a menos que obtengamos la cita original.
                    $citaId = $this->route('id') ?? $this->route('cita');
                    $cita = \App\Models\Cita::find($citaId);
                    if (!$cita) return;

                    $fechaAValidar = $this->fecha ?? $cita->fecha;
                    
                    // Aseguramos que el valor tenga segundos
                    $horaFiltro = strlen($value) === 5 ? $value . ':00' : $value;

                    $colision = \App\Models\Cita::where('doc_medico', $this->doc_medico ?? $cita->doc_medico)
                        ->where('fecha', $fechaAValidar)
                        ->where('hora_inicio', $horaFiltro)
                        ->where('id_cita', '!=', $citaId)
                        ->where('id_estado', '!=', \App\Models\Estado::where('nombre_estado', 'Cancelada')->value('id_estado'))
                        ->exists();

                    if ($colision) {
                        $fail('El médico ya tiene una cita en ese horario u otra cita interfiere.');
                    }
                }
            ],
            'hora_fin' => 'nullable|date_format:H:i:s',
            'motivo' => 'sometimes|string|max:255',
            'tipo_cita_id' => 'sometimes|integer|exists:tipo_cita,id_tipo_cita',
            'id_estado' => 'sometimes|integer|exists:estado,id_estado',
        ];
    }
}
