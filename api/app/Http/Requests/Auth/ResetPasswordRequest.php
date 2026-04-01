<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request para restablecer contrasena.
 */
class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => 'required|email',
            'code'     => 'required|numeric',
            'password' => 'required|string|min:8|max:25|regex:/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'   => 'El correo electrónico es obligatorio.',
            'email.email'      => 'El formato del correo electrónico no es válido.',
            'code.required'    => 'El código es obligatorio.',
            'code.numeric'     => 'El código debe ser numérico.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min'      => 'La contraseña debe tener al menos 8 caracteres.',
            'password.max'      => 'La contraseña debe tener como máximo 25 caracteres.',
            'password.regex'    => 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.',
        ];
    }
}
