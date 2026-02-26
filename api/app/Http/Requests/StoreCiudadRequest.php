<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCiudadRequest extends FormRequest
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
            'codigo_postal'   => 'required|integer|unique:ciudad,codigo_postal',
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
            'codigo_postal.required'   => 'El código postal es obligatorio.',
            'codigo_postal.integer'    => 'El código postal debe ser un número entero.',
            'codigo_postal.unique'     => 'Este código postal ya se encuentra registrado.',
            'nombre.required'          => 'El nombre de la ciudad es obligatorio.',
            'nombre.max'               => 'El nombre no puede exceder los 50 caracteres.',
            'id_departamento.required' => 'El departamento asociado es obligatorio.',
            'id_departamento.exists'   => 'El departamento seleccionado no es válido.',
            'id_estado.required'       => 'El estado es obligatorio.',
            'id_estado.exists'         => 'El estado seleccionado no es válido.',
        ];
    }
}
