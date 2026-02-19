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
            'nit' => ['required', 'numeric', 'unique:empresa,nit', 'regex:/^[1-9][0-9]{8}-[0-9]$/', 'max:12', 'min:10'],
            'nombre' => ['required', 'string', 'min:3', 'max:100', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/'],
            'email_contacto' => ['required', 'email:rfc,dns', 'unique:empresa,email_contacto', 'max:100'],
            'telefono' => ['required', 'numeric', 'min:10', 'max:10', 'regex:/^\d{1,10}$/'],
            'direccion' => ['required', 'string', 'min:7', 'max:150', 'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,]+$/'],
            'documento_representante' => ['required', 'numeric', 'unique:empresa,documento_representante', 'min:6', 'max:10', 'regex:/^\d{1,10}$/'],
            'nombre_representante' => ['required', 'string', 'min:3', 'max:50', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/'],
            'telefono_representante' => ['required', 'numeric', 'min:10', 'max:10', 'regex:/^\d{1,10}$/'],
            'email_representante' => ['required', 'email:rfc,dns', 'unique:empresa,email_representante', 'max:100'],
            'id_estado' => ['required', 'exists:estado,id_estado'],
            'admin_nombre' => ['required', 'string', 'min:3', 'max:20', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'admin_apellido' => ['required', 'string', 'min:3', 'max:20', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'admin_documento' => ['required', 'numeric', 'unique:usuario,documento', 'min:6', 'max:10', 'regex:/^\d{1,10}$/'],
            'admin_email' => ['required', 'email:rfc,dns', 'unique:usuario,email', 'max:100'],
            'admin_telefono' => ['required', 'numeric', 'regex:/^\d{1,10}$/', 'unique:usuario,telefono', 'min:10', 'max:10'],
            'admin_direccion' => ['required', 'string', 'min:7', 'max:150', 'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,]+$/'],
            'admin_password' => ['required', 'string', 'min:8', 'max:25', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
            'id_ciudad' => ['required', 'exists:ciudad,codigo_postal'],
        ];
    }

    public function messages(): array
    {
        return [
            'nit.required' => 'El documento es obligatorio',
            'nit.unique' => 'Esta empresa ya tiene un registro',
            'nit.regex' => 'El NIT debe tener el formato de 9 dígitos, un guion y un dígito final (ejemplo: 900123456-7)',
            'nit.max' => 'El NIT debe tener como maximo 12 caracteres',
            'nit.min' => 'El NIT debe tener como minimo 11 caracteres',

            'nombre.required' => 'El nombre de la Empresa es obligatorio',
            'nombre.min' => 'El nombre de la empresa debe tener al menos 3 caracteres',
            'nombre.max' => 'El nombre de la empresa no puede ser mayor a 100 caracteres',
            'nombre.regex' => 'El nombre de la empresa debe tener solo letras y numeros',

            'email_contacto.unique' => 'Este correo ya existe',
            'email_contacto.required' => 'El correo es obligatorio',
            'email_contacto.email' => 'El correo debe ser un correo valido',
            'email_contacto.max' => 'El correo debe tener como maximo 100 caracteres',

            'telefono.required' => 'El telefono es obligatorio',
            'telefono.min' => 'El telefono debe tener al menos 10 digitos',
            'telefono.max' => 'El telefono debe tener como maximo 10 digitos',
            'telefono.regex' => 'El telefono debe tener solo numeros',

            'direccion.required' => 'La direccion es obligatoria',
            'direccion.min' => 'La direccion debe tener al menos 7 caracteres',
            'direccion.max' => 'La direccion debe tener como maximo 150 caracteres',
            'direccion.regex' => 'La dirección debe contener letras y números, y puede incluir #, -, . o ,.',

            'id_ciudad.required' => 'La ciudad es obligatoria',

            'documento_representante.required' => 'El documento del representante es obligatorio',
            'documento_representante.unique' => 'Este documento ya está registrado',
            'documento_representante.min' => 'El documento debe tener al menos 6 digitos',
            'documento_representante.max' => 'El documento debe tener como maximo 10 digitos',
            'documento_representante.regex' => 'El documento debe tener solo numeros',

            'nombre_representante.required' => 'El nombre del representante es obligatorio',
            'nombre_representante.min' => 'El nombre del representante debe tener al menos 3 caracteres',
            'nombre_representante.max' => 'El nombre del representante debe tener como maximo 50 caracteres',
            'nombre_representante.regex' => 'El nombre del representante debe tener solo letras',

            'telefono_representante.required' => 'El telefono del representante es obligatorio',
            'telefono_representante.min' => 'El telefono debe tener al menos 10 digitos',
            'telefono_representante.max' => 'El telefono debe tener como maximo 10 digitos',
            'telefono_representante.regex' => 'El telefono debe tener solo numeros',

            'email_representante.required' => 'El correo del representante es obligatorio',
            'email_representante.unique' => 'Este correo ya existe',
            'email_representante.email' => 'El correo debe ser un correo valido',
            'email_representante.max' => 'El correo debe tener como maximo 100 caracteres',

            'id_estado.required' => 'El estado es obligatorio',

            'admin_nombre.required' => 'El nombre del administrador es obligatorio',
            'admin_nombre.min' => 'El nombre del administrador debe tener al menos 3 caracteres',
            'admin_nombre.max' => 'El nombre del administrador debe tener como maximo 50 caracteres',
            'admin_nombre.regex' => 'El nombre del administrador debe tener solo letras',

            'admin_apellido.required' => 'El apellido del administrador es obligatorio',
            'admin_apellido.min' => 'El apellido del administrador debe tener al menos 3 caracteres',
            'admin_apellido.max' => 'El apellido del administrador debe tener como maximo 50 caracteres',
            'admin_apellido.regex' => 'El apellido del administrador debe tener solo letras',

            'admin_documento.required' => 'El documento del administrador es obligatorio',
            'admin_documento.unique' => 'Este documento ya está registrado',
            'admin_documento.min' => 'El documento debe tener al menos 6 digitos',
            'admin_documento.max' => 'El documento debe tener como maximo 10 digitos',
            'admin_documento.regex' => 'El documento debe tener solo numeros',

            'admin_email.required' => 'El correo del administrador es obligatorio',
            'admin_email.unique' => 'Este correo ya existe',
            'admin_email.email' => 'El correo debe ser un correo valido',

            'admin_telefono.required' => 'El telefono del administrador es obligatorio',
            'admin_telefono.unique' => 'Este telefono ya está registrado',
            'admin_telefono.min' => 'El telefono debe tener al menos 10 digitos',
            'admin_telefono.max' => 'El telefono debe tener como maximo 10 digitos',
            'admin_telefono.regex' => 'El telefono solo debe tener numeros',

            'admin_direccion.required' => 'La direccion del administrador es obligatoria',
            'admin_direccion.min' => 'La direccion debe tener al menos 7 caracteres',
            'admin_direccion.max' => 'La direccion debe tener como maximo 150 caracteres',
            'admin_direccion.regex' => 'La dirección debe contener letras y números, y puede incluir #, -, . o ,.',

            'admin_password.required' => 'La contraseña del administrador es obligatoria',
            'admin_password.min' => 'La contraseña del administrador debe tener al menos 8 caracteres',
            'admin_password.max' => 'La contraseña del administrador debe tener como maximo 25 caracteres',
            'admin_password.regex' => 'La contraseña del administrador debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial: @$!%*?&',
        ];
    }
}