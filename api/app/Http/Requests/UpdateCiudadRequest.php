<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCiudadRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'nombre'          => 'required|string|max:50',
            'id_departamento' => 'required|exists:departamento,codigo_DANE',
            'id_estado'       => 'required|exists:estado,id_estado',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required'          => 'El nombre de la ciudad es obligatorio.',
            'nombre.max'               => 'El nombre no puede exceder los 50 caracteres.',
            'id_departamento.required' => 'El departamento asociado es obligatorio.',
            'id_departamento.exists'   => 'El departamento seleccionado no es válido.',
            'id_estado.required'       => 'El estado es obligatorio.',
            'id_estado.exists'         => 'El estado seleccionado no es válido.',
        ];
    }
}
