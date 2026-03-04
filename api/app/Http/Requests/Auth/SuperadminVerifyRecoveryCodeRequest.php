<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SuperadminVerifyRecoveryCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'code'  => 'required|numeric|digits:6|regex:/^[0-9]+$/'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El correo es obligatorio',
            'email.email'    => 'El correo debe ser válido',
            'code.required'  => 'El código es obligatorio',
            'code.numeric'   => 'El código debe ser numérico',
            'code.digits'    => 'El código debe tener 6 dígitos',
            'code.regex'     => 'El código debe tener 6 números sin espacios.',
        ];
    }
}
