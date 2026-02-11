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
            'documento' => ['required', 'numeric', 'unique:usuario,documento'],
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:usuario,email'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', 'in:ACTIVO,INACTIVO'],
            'id_rol' => ['required', 'exists:rol,id_rol'],
            
        ];
    }

    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es obligatorio',
            'documento.unique' => 'Este documento ya está registrado',
            'email.unique' => 'Este correo ya existe',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'status.required' => 'El estado es obligatorio',
            
        ];
    }
}
