<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartamentoRequest extends FormRequest
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
            'nombre'    => 'required|string|max:50',
            'id_estado' => 'required|exists:estado,id_estado',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required'    => 'El nombre del departamento es obligatorio.',
            'nombre.max'         => 'El nombre no puede exceder los 50 caracteres.',
            'id_estado.required' => 'El estado es obligatorio.',
            'id_estado.exists'   => 'El estado seleccionado no es válido.',
        ];
    }
}
