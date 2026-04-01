<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

/**
 * Request de actualizacion de usuario.
 * Controla campos editables y reglas de consistencia.
 */
class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('usuario');
        $isPatient = $this->id_rol == 5;

        $rules = [
            'id_tipo_documento' => ['required', 'exists:tipo_documento,id_tipo_documento'],
            'documento' => ['required', 'regex:/^[1-9][0-9]*$/', 'numeric', 'unique:usuario,documento,' . $id . ',documento'],
            'primer_nombre' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'segundo_nombre' => ['nullable', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/'],
            'primer_apellido' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/'],
            'segundo_apellido' => ['nullable', 'string', 'min:3', 'max:40', 'regex:/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/'],
            'email' => ['required', 'regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', 'email:rfc,dns', 'min:12', 'max:150', new UniqueIgnoreCase('usuario', 'email', $id, 'documento')],
            'telefono' => ['required', 'regex:/^3\d{9}$/', 'digits:10', 'unique:usuario,telefono,' . $id . ',documento'],
            'direccion' => ['required', 'string', 'regex:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/', 'min:8', 'max:150'],
            'fecha_nacimiento' => ['required', 'date'],
            'sexo' => ['required', 'string', 'max:10', 'in:Masculino,Femenino'],
            'id_estado' => ['required', 'in:1,2'],
            'id_rol' => ['required', 'exists:rol,id_rol'],
            'examenes' => ['nullable', 'boolean'],
        ];

        switch ($this->id_rol) {
            case 4:
                $rules['registro_profesional'] = ['nullable', 'string', 'regex:/^\d{1,10}$/', 'unique:usuario,registro_profesional,' . $id . ',documento'];
                $rules['id_especialidad'] = ['required', 'exists:especialidad,id_especialidad'];
                $rules['id_consultorio'] = ['nullable', 'exists:consultorio,id_consultorio'];
                break;
            case 5:
                $rules['grupo_sanguineo'] = ['required', 'string', 'max:10', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'];
                break;
        }

        // Restricciones para tipo de documento
        if (!$isPatient) {
            $rules['id_tipo_documento'][] = 'in:1,3';
        }

        // Restricciones para el campo documento basado en tipo
        if ($this->id_tipo_documento == 3) {
            $rules['documento'][] = 'digits_between:6,12';
        } else {
            $rules['documento'][] = 'digits_between:7,10';
        }

        // Restricciones de edad para fecha de nacimiento
        if ($isPatient) {
            $rules['fecha_nacimiento'][] = 'before_or_equal:today';
        } else {
            // Mayor de edad: restar 18 años a la fecha actual
            $dt18 = now()->subYears(18)->format('Y-m-d');
            $rules['fecha_nacimiento'][] = 'before_or_equal:' . $dt18;
        }

        return $rules;
    }

    public function messages(): array
    {
        $messages = [
            'id_tipo_documento.required' => 'El tipo de documento es obligatorio',
            'id_tipo_documento.exists' => 'El tipo de documento seleccionado no es válido',
            'documento.required' => 'El documento es obligatorio',
            'documento.unique' => 'Este documento ya está registrado',
            'documento.regex' => 'El documento debe tener solo numeros sin espacios ni puntos',
            'documento.numeric' => 'El documento debe ser numerico',
            'primer_nombre.required' => 'El primer nombre es obligatorio',
            'primer_nombre.min' => 'El primer nombre debe tener al menos 3 caracteres',
            'primer_nombre.max' => 'El primer nombre debe tener como maximo 40 caracteres',
            'primer_nombre.regex' => 'El primer nombre debe tener solo letras sin espacios',
            'primer_nombre.string' => 'El primer nombre debe ser texto',
            'segundo_nombre.min' => 'El segundo nombre debe tener al menos 3 caracteres',
            'segundo_nombre.max' => 'El segundo nombre debe tener como maximo 40 caracteres',
            'segundo_nombre.regex' => 'El segundo nombre debe tener solo letras sin espacios',
            'primer_apellido.required' => 'El primer apellido es obligatorio',
            'primer_apellido.min' => 'El primer apellido debe tener al menos 3 caracteres',
            'primer_apellido.max' => 'El primer apellido debe tener como maximo 40 caracteres',
            'primer_apellido.regex' => 'El primer apellido debe tener solo letras sin espacios dobles',
            'primer_apellido.string' => 'El primer apellido debe ser texto',
            'segundo_apellido.min' => 'El segundo apellido debe tener al menos 3 caracteres',
            'segundo_apellido.max' => 'El segundo apellido debe tener como maximo 40 caracteres',
            'segundo_apellido.regex' => 'El segundo apellido debe tener solo letras sin espacios dobles',
            'email.required' => 'El correo es obligatorio',
            'email.unique' => 'Este correo ya existe',
            'email.email' => 'El correo debe ser un correo valido',
            'email.min' => 'El correo debe tener al menos 12 caracteres',
            'email.max' => 'El correo debe tener como maximo 150 caracteres',
            'email.regex' => 'El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido.',
            'telefono.required' => 'El telefono es obligatorio',
            'telefono.regex' => 'El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos',
            'telefono.digits' => 'El telefono debe tener exactamente 10 digitos',
            'telefono.unique' => 'Este telefono ya está registrado',
            'telefono.numeric' => 'El telefono debe ser numerico',
            'direccion.required' => 'La direccion es obligatoria',
            'direccion.min' => 'La direccion debe tener al menos 8 caracteres',
            'direccion.max' => 'La direccion debe tener como maximo 150 caracteres',
            'direccion.regex' => 'La dirección debe contener letras y números, y puede incluir #, -, . o ,.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria',
            'fecha_nacimiento.date' => 'La fecha de nacimiento debe ser una fecha valida',
            'registro_profesional.required' => 'El registro profesional es obligatorio',
            'registro_profesional.regex' => 'El registro profesional debe ser maximo de 10 digitos',
            'id_especialidad.required' => 'La especialidad es obligatoria',
            'sexo.required' => 'El sexo es obligatorio',
            'sexo.in' => 'El sexo debe ser Masculino o Femenino',
            'grupo_sanguineo.required' => 'El grupo sanguineo es obligatorio',
            'grupo_sanguineo.in' => 'El grupo sanguineo debe ser A+, A-, B+, B-, AB+, AB-, O+, O-',
            'id_estado.required' => 'El estado es obligatorio',
            'id_rol.required' => 'El rol es obligatorio',
            'id_rol.exists' => 'El rol no existe',
        ];

        if ($this->id_rol != 5) {
            $messages['id_tipo_documento.in'] = 'Este tipo de documento es exclusivo para pacientes';
            $messages['fecha_nacimiento.before_or_equal'] = 'El usuario debe ser mayor de edad para este rol (18+ años)';
        } else {
            $messages['fecha_nacimiento.before_or_equal'] = 'La fecha de nacimiento no puede ser una fecha futura';
        }

        if ($this->id_tipo_documento == 3) {
            $messages['documento.digits_between'] = 'El documento debe tener entre 6 y 12 digitos';
        } else {
            $messages['documento.digits_between'] = 'El documento debe tener entre 7 y 10 digitos';
        }

        return $messages;
    }
}
