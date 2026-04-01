<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request de inicio de sesion para superadmin.
 */
class SuperadminLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => 'required|regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/|email:rfc,dns|max:150|min:12',
            'password' => 'required|string|max:25|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'El correo es obligatorio',
            'email.email'       => 'El correo debe ser válido',
            'email.regex'       => 'El formato del correo no es válido',
            'email.max'         => 'El correo debe tener máximo 150 caracteres',
            'email.min'         => 'El correo debe tener mínimo 12 caracteres',
            'password.required' => 'La contraseña es obligatoria',
            'password.max'      => 'La contraseña debe tener máximo 25 caracteres',
            'password.min'      => 'La contraseña debe tener mínimo 8 caracteres',
        ];
    }
}
