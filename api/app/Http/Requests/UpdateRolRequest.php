<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRolRequest extends FormRequest
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
        $id = $this->route('id');

        return [
            'tipo_usu' => [
                'required',
                'string',
                'max:50',
                'unique:rol,tipo_usu,' . $id . ',id_rol',
                function ($attribute, $value, $fail) {
                    if (strtoupper($value) === 'SUPERADMIN') {
                        $fail('El valor "SUPERADMIN" no está permitido para el tipo de usuario.');
                    }
                },
            ],
            'id_estado' => 'required|exists:estado,id_estado',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'tipo_usu.required' => 'El tipo de usuario es obligatorio.',
            'tipo_usu.string' => 'El tipo de usuario debe ser una cadena de texto.',
            'tipo_usu.max' => 'El tipo de usuario no puede tener más de 50 caracteres.',
            'tipo_usu.unique' => 'Este tipo de usuario ya está registrado en otro registro.',
            'id_estado.required' => 'El estado es obligatorio.',
            'id_estado.exists' => 'El estado seleccionado no existe.',
        ];
    }
}
