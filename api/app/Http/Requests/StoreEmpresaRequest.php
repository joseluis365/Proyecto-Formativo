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
            'documento_representante' => ['required', 'numeric', 'unique:empresa,documento_representante'],
            'nombre_representante' => ['required', 'string'],
            'telefono_representante' => ['required', 'numeric'],
            'email_representante' => ['required', 'email', 'unique:empresa,email_representante'],
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
            'email_contacto.required' => 'El correo es obligatorio',
            'email_contacto.email' => 'El correo debe ser un correo valido',
            'telefono.required' => 'El telefono es obligatorio',
            'direccion.required' => 'La direccion es obligatoria',
            'documento_representante.required' => 'El documento del representante es obligatorio',
            'documento_representante.unique' => 'Este documento ya está registrado',
            'nombre_representante.required' => 'El nombre del representante es obligatorio',
            'telefono_representante.required' => 'El telefono del representante es obligatorio',
            'email_representante.required' => 'El correo del representante es obligatorio',
            'email_representante.unique' => 'Este correo ya existe',
            'id_estado.required' => 'El estado es obligatorio',
            'admin_nombre.required' => 'El nombre del administrador es obligatorio',
            'admin_documento.required' => 'El documento del administrador es obligatorio',
            'admin_email.required' => 'El correo del administrador es obligatorio',
            'admin_password.required' => 'La contraseña del administrador es obligatoria',
            'admin_password.min' => 'La contraseña del administrador debe tener al menos 8 caracteres',
            'nombre.required' => 'El nombre es obligatorio',
            
        ];
    }
}