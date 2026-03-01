<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFarmaciaRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'nit'              => 'required|string|max:20|unique:farmacia,nit',
            'nombre'           => 'required|string|max:100',
            'direccion'        => 'nullable|string|max:150',
            'telefono'         => 'nullable|string|max:30',
            'email'            => 'nullable|email|max:100',
            'nombre_contacto'  => 'nullable|string|max:100',
            'horario_apertura' => 'nullable|date_format:H:i',
            'horario_cierre'   => 'nullable|date_format:H:i',
            'abierto_24h'      => 'boolean',
            'nit_empresa'      => 'required|exists:empresa,nit',
            'id_estado'        => 'required|exists:estado,id_estado',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'nit.required'              => 'El NIT es obligatorio.',
            'nit.unique'                => 'Este NIT ya se encuentra registrado.',
            'nombre.required'           => 'El nombre de la farmacia es obligatorio.',
            'nit_empresa.required'      => 'La empresa asociada es obligatoria.',
            'nit_empresa.exists'        => 'La empresa seleccionada no es válida.',
            'id_estado.required'        => 'El estado es obligatorio.',
            'id_estado.exists'          => 'El estado seleccionado no es válido.',
            'horario_apertura.date_format' => 'El formato del horario de apertura debe ser H:i.',
            'horario_cierre.date_format'   => 'El formato del horario de cierre debe ser H:i.',
        ];
    }
}
