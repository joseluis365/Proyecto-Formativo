<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'numeric', 'unique:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', 'in:ACTIVO,INACTIVO'],
            'id_rol' => ['required', 'exists:rol,id_rol'],
            
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'El documento es obligatorio',
            'id.unique' => 'Este documento ya está registrado',
            'email.unique' => 'Este correo ya existe',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'status.required' => 'El estado es obligatorio',
            
        ];
    }
}
