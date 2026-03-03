<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class StoreEspecialidadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'especialidad' => ['required', 'string', 'max:150', new UniqueIgnoreCase('especialidad', 'especialidad')]
        ];
    }

    public function messages(): array
    {
        return [
            'especialidad.required' => 'El nombre de la especialidad es obligatorio.',
            'especialidad.unique' => 'Esta especialidad ya existe.',
            'especialidad.max' => 'La especialidad no puede tener más de 150 caracteres.'
        ];
    }
}
