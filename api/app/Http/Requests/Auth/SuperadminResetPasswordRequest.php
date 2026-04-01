<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request para restablecer contrasena de superadmin.
 */
class SuperadminResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => 'required|email',
            'code'     => 'required|numeric|digits:6|regex:/^[0-9]{6}$/',
            'password' => 'required|string|regex:/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/|min:8|max:25|confirmed'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'      => 'El correo es obligatorio',
            'email.email'         => 'El correo debe ser válido',
            'code.required'       => 'El código es obligatorio',
            'code.numeric'        => 'El código debe ser numérico',
            'code.digits'         => 'El código debe tener 6 dígitos',
            'code.regex'          => 'El código debe tener 6 números sin espacios.',
            'password.required'   => 'La contraseña es obligatoria',
            'password.string'     => 'La contraseña debe ser una cadena de texto',
            'password.min'        => 'La contraseña debe tener mínimo 8 caracteres',
            'password.regex'      => 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial',
            'password.confirmed'  => 'Las contraseñas no coinciden',
            'password.max'        => 'La contraseña debe tener máximo 25 caracteres',
        ];
    }
}
