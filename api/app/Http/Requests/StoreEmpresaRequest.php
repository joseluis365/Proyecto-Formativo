<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nit' => ['required', 'numeric', 'unique:empresa,nit'],
            'nombre' => ['required', 'string', 'max:255'],
            'email_contacto' => ['required', 'email', 'unique:empresa,email_contacto'],
            'telefono' => ['required', 'numeric'],
            'direccion' => ['required', 'string'],
            'documento_representante' => ['required', 'numeric'],
            'nombre_representante' => ['required', 'string'],
            'telefono_representante' => ['required', 'numeric'],
            'email_representante' => ['required', 'email'],
            'id_estado' => ['required', 'exists:estado,id_estado'],
            'admin_nombre' => ['required', 'string', 'max:255'],
            'admin_documento' => ['required', 'numeric', 'unique:usuario,documento'],
            'admin_email' => ['required', 'email', 'unique:usuario,email'],
            'admin_password' => ['required', 'string', 'min:6'],
            
        ];
    }

    public function messages(): array
    {
        return [
            'nit.required' => 'El documento es obligatorio',
            'nit.unique' => 'Este documento ya está registrado',
            'email_contacto.unique' => 'Este correo ya existe',
            'telefono.required' => 'El telefono es obligatorio',
            'direccion.required' => 'La direccion es obligatoria',
            'documento_representante.required' => 'El documento del representante es obligatorio',
            'nombre_representante.required' => 'El nombre del representante es obligatorio',
            'telefono_representante.required' => 'El telefono del representante es obligatorio',
            'email_representante.required' => 'El correo del representante es obligatorio',
            'id_estado.required' => 'El estado es obligatorio',
            
        ];
    }
}