<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEstadoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Bloquea la operación si el id_estado es menor a 7.
     */
    public function authorize(): bool
    {
        $id = $this->route('id');
        return $id >= 7;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'nombre_estado' => 'required|string|max:50|unique:estado,nombre_estado,' . $id . ',id_estado'
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
            'nombre_estado.unique'   => 'Este nombre de estado ya está registrado en otro registro.',
        ];
    }
}
