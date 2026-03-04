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
            'fecha' => 'required|date',
            'motivo' => 'required|string|max:255',
            'tipo_cita_id' => 'required|integer|exists:tipo_cita,id_tipo_cita',
        ];
    }
}
