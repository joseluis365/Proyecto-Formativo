<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\UniqueIgnoreCase;

class StoreEmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nit' => ['required', 'unique:empresa,nit', 'regex:/^[0-9\-]+$/', 'regex:/^[1-9][0-9]{8}-[0-9]$/', 'min:10', 'max:12'],
            'nombre' => ['required', 'string', 'min:3', 'max:50', 'regex:/^(?!.*\s{2,})(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\.,&\/]+$/', new UniqueIgnoreCase('empresa', 'nombre')],
            'email_contacto' => ['required', 'regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', 'email:rfc,dns', new UniqueIgnoreCase('empresa', 'email_contacto'), 'min:12', 'max:150'],
            'telefono' => ['required', 'regex:/^(3\d{9}|60[1-8]\d{7})$/', 'digits:10', 'unique:empresa,telefono'],
            'id_departamento' => ['required', 'regex:/^[1-9][0-9]*$/', 'min:2', 'max:2', 'exists:departamento,codigo_DANE'],
            'id_ciudad' => [
                'required',
                'regex:/^[1-9][0-9]*$/',
                'min:5',
                'max:6',
                Rule::exists('ciudad', 'codigo_postal')
                    ->where(function ($query) {
                        $query->where('id_departamento', $this->id_departamento);
                    }),
            ],
            'direccion' => ['required', 'string', 'min:8', 'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/', 'max:150', 'unique:empresa,direccion'],
            'documento_representante' => ['required', 'regex:/^[1-9][0-9]*$/', 'numeric', 'digits_between:7,10', 'unique:empresa,documento_representante'],
            'nombre_representante' => ['required', 'string', 'min:3', 'max:50', 'regex:/^(?!.*\s{2,})(?!^\s)(?!.*\s$)[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/'],
            'telefono_representante' => ['required', 'regex:/^3\d{9}$/', 'digits:10', 'unique:empresa,telefono_representante'],
            'email_representante' => ['required', 'regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', 'email:rfc,dns', 'min:12', 'max:150', new UniqueIgnoreCase('empresa', 'email_representante')],
            'id_estado' => ['required', 'exists:estado,id_estado'],
            'admin_primer_nombre' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'admin_segundo_nombre' => ['nullable', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'admin_primer_apellido' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/'],
            'admin_segundo_apellido' => ['nullable', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/'],
            'admin_documento' => ['required', 'regex:/^[1-9][0-9]*$/', 'digits_between:7,10', 'numeric', 'unique:usuario,documento'],
            'admin_id_tipo_documento' => ['required', 'in:1,3'],
            'admin_fecha_nacimiento' => ['required', 'date', 'before_or_equal:' . now()->subYears(18)->format('Y-m-d')],
            'admin_sexo' => ['required', 'in:Masculino,Femenino'],
            'admin_email' => ['required', 'regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', 'email:rfc,dns', 'min:12', 'max:150', new UniqueIgnoreCase('usuario', 'email')],
            'admin_telefono' => ['required', 'regex:/^3\d{9}$/', 'digits:10', 'unique:usuario,telefono'],
            'admin_direccion' => ['required', 'string', 'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/', 'min:8', 'max:150'],
            'admin_password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/', 'max:25'],
        ];
    }

    public function messages(): array
    {
        return [
            'nit.required' => 'El NIT es obligatorio',
            'nit.unique' => 'Esta empresa ya tiene un registro',
            'nit.regex' => 'El NIT debe tener 9 números (sin empezar por 0), un guion y 1 dígito de verificación en el formato correcto (ejemplo: 900123456-7)',
            'nit.digits_between' => 'El NIT debe tener entre 10 y 12 caracteres',

            'nombre.required' => 'El nombre de la Empresa es obligatorio',
            'nombre.unique' => 'Este nombre ya está registrado',
            'nombre.min' => 'El nombre de la empresa debe tener al menos 3 caracteres',
            'nombre.max' => 'El nombre de la empresa no puede ser mayor a 50 caracteres',
            'nombre.regex' => 'El nombre de la empresa debe tener al menos una letra, numeros y algunos caracteres (-, ., &, /)',

            'email_contacto.unique' => 'Este correo ya existe',
            'email_contacto.required' => 'El correo es obligatorio',
            'email_contacto.email' => 'El correo debe ser un correo valido',
            'email_contacto.min' => 'El correo debe tener al menos 12 caracteres',
            'email_contacto.max' => 'El correo debe tener como maximo 150 caracteres',
            'email_contacto.regex' => 'El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido.',

            'telefono.required' => 'El telefono es obligatorio',
            'telefono.regex' => 'El telefono debe iniciar con 3 o 60 y tener 10 digitos numericos sin espacios',
            'telefono.digits' => 'El telefono debe tener exactamente 10 caracteres',
            'telefono.unique' => 'Este telefono ya está registrado',

            'id_departamento.required' => 'El departamento es obligatorio',
            'id_departamento.exists' => 'El departamento seleccionado no existe',
            'id_departamento.regex' => 'El departamento debe ser un número válido',
            'id_departamento.min' => 'El departamento debe tener como minimo 2 caracteres',
            'id_departamento.max' => 'El departamento debe tener como maximo 2 caracteres',

            'id_ciudad.required' => 'La ciudad es obligatoria',
            'id_ciudad.exists' => 'La ciudad seleccionada no pertenece al departamento escogido',
            'id_ciudad.regex' => 'La ciudad debe ser un número válido',
            'id_ciudad.min' => 'La ciudad debe tener como minimo 5 caracteres',
            'id_ciudad.max' => 'La ciudad debe tener como maximo 6 caracteres',

            'direccion.required' => 'La direccion es obligatoria',
            'direccion.unique' => 'Esta direccion ya está registrada',
            'direccion.min' => 'La direccion debe tener al menos 8 caracteres',
            'direccion.max' => 'La direccion debe tener como maximo 150 caracteres',
            'direccion.regex' => 'La dirección debe contener letras y números, y puede incluir #, -, . o ,.',

            'documento_representante.required' => 'El documento del representante es obligatorio',
            'documento_representante.unique' => 'Este documento ya está registrado',
            'documento_representante.digits_between' => 'El documento debe tener entre 7 y 10 digitos',
            'documento_representante.regex' => 'El documento debe tener solo números y no empezar por 0',
            'documento_representante.numeric' => 'El documento debe ser un número',

            'nombre_representante.required' => 'El nombre del representante es obligatorio',
            'nombre_representante.min' => 'El nombre del representante debe tener al menos 3 caracteres',
            'nombre_representante.max' => 'El nombre del representante debe tener como maximo 50 caracteres',
            'nombre_representante.regex' => 'El nombre del representante debe tener solo letras y no debe contener dobles espacios ni espacios al inicio o final',

            'telefono_representante.required' => 'El telefono del representante es obligatorio',
            'telefono_representante.digits' => 'El telefono debe tener exactamente 10 digitos',
            'telefono_representante.regex' => 'El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos',
            'telefono_representante.unique' => 'Este telefono ya está registrado',

            'email_representante.required' => 'El correo del representante es obligatorio',
            'email_representante.unique' => 'Este correo ya existe',
            'email_representante.email' => 'El correo debe ser un correo valido',
            'email_representante.min' => 'El correo debe tener al menos 12 caracteres',
            'email_representante.max' => 'El correo debe tener como maximo 150 caracteres',
            'email_representante.regex' => 'El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido.',

            'id_estado.required' => 'El estado es obligatorio',

            'admin_primer_nombre.required' => 'El primer nombre del administrador es obligatorio',
            'admin_primer_nombre.min' => 'El primer nombre del administrador debe tener al menos 3 caracteres',
            'admin_primer_nombre.max' => 'El primer nombre del administrador debe tener como maximo 40 caracteres',
            'admin_primer_nombre.regex' => 'El primer nombre del administrador debe tener solo letras sin esapcios',

            'admin_segundo_nombre.min' => 'El segundo nombre del administrador debe tener al menos 3 caracteres',
            'admin_segundo_nombre.max' => 'El segundo nombre del administrador debe tener como maximo 40 caracteres',
            'admin_segundo_nombre.regex' => 'El segundo nombre del administrador debe tener solo letras sin esapcios',

            'admin_primer_apellido.required' => 'El primer apellido del administrador es obligatorio',
            'admin_primer_apellido.min' => 'El primer apellido del administrador debe tener al menos 3 caracteres',
            'admin_primer_apellido.max' => 'El primer apellido del administrador debe tener como maximo 40 caracteres',
            'admin_primer_apellido.regex' => 'El primer apellido del administrador debe tener solo letras sin esapcios dobles',

            'admin_segundo_apellido.min' => 'El segundo apellido del administrador debe tener al menos 3 caracteres',
            'admin_segundo_apellido.max' => 'El segundo apellido del administrador debe tener como maximo 40 caracteres',
            'admin_segundo_apellido.regex' => 'El segundo apellido del administrador debe tener solo letras sin esapcios dobles',

            'admin_documento.required' => 'El documento del administrador es obligatorio',
            'admin_documento.numeric' => 'El documento debe ser un número',
            'admin_documento.unique' => 'Este documento ya está registrado',
            'admin_documento.digits_between' => 'El documento debe tener entre 7 y 10 digitos',
            'admin_documento.regex' => 'El documento debe tener solo números y no empezar por 0',
            
            'admin_id_tipo_documento.required' => 'El tipo de documento es obligatorio',
            'admin_id_tipo_documento.in' => 'El tipo de documento debe ser 1 o 3',
            'admin_fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria',
            'admin_fecha_nacimiento.date' => 'La fecha de nacimiento debe ser una fecha válida',
            'admin_fecha_nacimiento.before_or_equal' => 'El administrador debe ser mayor de edad',
            'admin_sexo.required' => 'El sexo es obligatorio',
            'admin_sexo.in' => 'El sexo debe ser Masculino o Femenino',

            'admin_email.required' => 'El correo del administrador es obligatorio',
            'admin_email.unique' => 'Este correo ya existe',
            'admin_email.email' => 'El correo debe ser un correo valido',
            'admin_email.min' => 'El correo debe tener al menos 12 caracteres',
            'admin_email.max' => 'El correo debe tener como maximo 150 caracteres',
            'admin_email.regex' => 'El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido.',

            'admin_telefono.required' => 'El telefono del administrador es obligatorio',
            'admin_telefono.unique' => 'Este telefono ya está registrado',
            'admin_telefono.digits' => 'El telefono debe tener exactamente 10 digitos',
            'admin_telefono.regex' => 'El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos',

            'admin_direccion.required' => 'La direccion del administrador es obligatoria',
            'admin_direccion.min' => 'La direccion debe tener al menos 8 caracteres',
            'admin_direccion.max' => 'La direccion debe tener como maximo 150 caracteres',
            'admin_direccion.regex' => 'La dirección debe contener letras y números, y puede incluir #, -, . o ,.',

            'admin_password.required' => 'La contraseña del administrador es obligatoria',
            'admin_password.min' => 'La contraseña del administrador debe tener al menos 8 caracteres',
            'admin_password.max' => 'La contraseña del administrador debe tener como maximo 25 caracteres',
            'admin_password.regex' => 'La contraseña del administrador debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial',
        ];
    }
}