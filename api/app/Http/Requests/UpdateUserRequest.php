<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('usuario');

        $rules = [
            'documento' => ['required', 'numeric', 'regex:/^\d{1,10}$/', 'unique:usuario,documento,' . $id . ',documento'],
            'primer_nombre' => ['required', 'string', 'max:255'],
            'segundo_nombre' => ['nullable', 'string', 'max:255'],
            'primer_apellido' => ['required', 'string', 'max:255'],
            'segundo_apellido' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', new UniqueIgnoreCase('usuario', 'email', $id, 'documento')],
            'telefono' => ['required', 'numeric', 'regex:/^\d{1,10}$/', 'unique:usuario,telefono,' . $id . ',documento'],
            'direccion' => ['required', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date'],
            'id_estado' => ['required', 'in:1,2'],
            'id_rol' => ['required', 'exists:rol,id_rol'],
        ];

        switch ($this->id_rol) {
            case 4:
                $rules['registro_profesional'] = ['required', 'string', 'regex:/^\d{1,10}$/', 'unique:usuario,registro_profesional,' . $id . ',documento'];
                $rules['id_especialidad'] = ['required', 'exists:especialidades,id_especialidad'];
                break;
            case 5:
                $rules['sexo'] = ['required', 'string', 'max:10', 'in:Masculino,Femenino'];
                $rules['grupo_sanguineo'] = ['required', 'string', 'max:10', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'];
                break;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es obligatorio',
            'documento.unique' => 'Este documento ya está registrado',
            'documento.regex' => 'El documento debe tener como maximo 10 digitos',
            'documento.numeric' => 'El documento debe ser numerico',
            'primer_nombre.required' => 'El primer nombre es obligatorio',
            'primer_nombre.max' => 'El primer nombre debe tener como maximo 255 caracteres',
            'primer_nombre.string' => 'El primer nombre debe ser texto',
            'primer_apellido.required' => 'El primer apellido es obligatorio',
            'primer_apellido.max' => 'El primer apellido debe tener como maximo 255 caracteres',
            'primer_apellido.string' => 'El primer apellido debe ser texto',
            'email.unique' => 'Este correo ya existe',
            'email.email' => 'El correo debe ser un correo valido',
            'telefono.required' => 'El telefono es obligatorio',
            'telefono.regex' => 'El telefono debe tener como maximo 10 digitos',
            'telefono.numeric' => 'El telefono debe ser numerico',
            'telefono.unique' => 'Este telefono ya está registrado',
            'direccion.required' => 'La direccion es obligatoria',
            'direccion.max' => 'La direccion debe tener como maximo 255 caracteres',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria',
            'fecha_nacimiento.date' => 'La fecha de nacimiento debe ser una fecha valida',
            'registro_profesional.required' => 'El registro profesional es obligatorio',
            'registro_profesional.regex' => 'El registro profesional debe ser maximo de 10 digitos',
            'id_especialidad.required' => 'La especialidad es obligatoria',
            'sexo.required' => 'El sexo del paciente es obligatorio',
            'sexo.in' => 'El sexo debe ser Masculino o Femenino',
            'grupo_sanguineo.required' => 'El grupo sanguineo es obligatorio',
            'grupo_sanguineo.in' => 'El grupo sanguineo debe ser A+, A-, B+, B-, AB+, AB-, O+, O-',
            'id_estado.required' => 'El estado es obligatorio',
            'id_rol.required' => 'El rol es obligatorio',
            'id_rol.exists' => 'El rol no existe',
        ];
    }
}
