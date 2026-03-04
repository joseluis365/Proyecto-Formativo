<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'hora_inicio' => 'nullable|date_format:H:i:s',
            'hora_fin' => 'nullable|date_format:H:i:s',
            'motivo' => 'sometimes|string|max:255',
            'tipo_cita_id' => 'sometimes|integer|exists:tipo_cita,id_tipo_cita',
            'id_estado' => 'sometimes|integer|exists:estado,id_estado',
        ];
    }
}
