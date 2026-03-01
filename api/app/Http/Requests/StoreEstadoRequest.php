<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEstadoRequest extends FormRequest
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
            'nombre_estado' => 'required|string|max:50|unique:estado,nombre_estado'
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'nombre_estado.required' => 'El nombre del estado es obligatorio.',
            'nombre_estado.string'   => 'El nombre del estado debe ser una cadena de texto.',
            'nombre_estado.max'      => 'El nombre del estado no puede tener más de 50 caracteres.',
            'nombre_estado.unique'   => 'Este nombre de estado ya está registrado.',
        ];
    }
}
