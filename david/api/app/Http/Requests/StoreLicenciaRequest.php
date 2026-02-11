<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLicenciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', 'string', 'max:255'],
            'descripcion' => ['required', 'string', 'max:255'],
            'precio' => ['required', 'numeric'],
            'duracion_meses' => ['required', 'numeric'],
            'id_estado' => ['required', 'exists:estado,id_estado'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.required' => 'El tipo es obligatorio',
            'descripcion.required' => 'La descripcion es obligatoria',
            'precio.required' => 'El precio es obligatorio',
            'duracion_meses.required' => 'La duracion es obligatoria',
            'id_estado.required' => 'El estado es obligatorio',
        ];
    }
}