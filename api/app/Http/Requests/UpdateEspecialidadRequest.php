<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class UpdateEspecialidadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'especialidad' => ['required', 'string', 'max:150', new UniqueIgnoreCase('especialidad', 'especialidad', $id, 'id_especialidad')]
        ];
    }

    public function messages(): array
    {
        return [
            'especialidad.required' => 'El nombre de la especialidad es obligatorio.',
            'especialidad.unique' => 'Ese nombre de especialidad ya está en uso.',
            'especialidad.max' => 'La especialidad no puede tener más de 150 caracteres.'
        ];
    }
}
