<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        \Illuminate\Support\Facades\Log::info('StoreUserRequest User:', ['user' => $this->user()]);
        $this->merge([
            'nit' => $this->user()->nit, // Aquí obtenemos el NIT del Admin logueado
        ]);
    }

    public function rules(): array
    {
        $rules = [
            'documento' => ['required', 'numeric', 'unique:usuario,documento', 'regex:/^\d{1,10}$/'],
            'nit' => ['required', 'exists:empresa,nit'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:usuario,email'],
            'telefono' => ['required', 'numeric', 'regex:/^\d{1,10}$/', 'unique:usuario,telefono'],
            'direccion' => ['required', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date'],
            'contrasena' => ['required', 'string', 'min:8', 'max:25', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
            'id_estado' => ['required', 'in:1,2'],
            'id_rol' => ['required', 'exists:rol,id_rol'],
            
        ];

        switch ($this->id_rol) {
            case 4:
                $rules['registro_profesional'] = ['required', 'unique:usuario,registro_profesional', 'string', 'regex:/^\d{1,10}$/'];
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
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre debe tener como maximo 255 caracteres',
            'nombre.string' => 'El nombre debe ser texto',
            'apellido.required' => 'El apellido es obligatorio',
            'apellido.max' => 'El apellido debe tener como maximo 255 caracteres',
            'apellido.string' => 'El apellido debe ser texto',
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
            'contrasena.required' => 'La contraseña es obligatoria',
            'contrasena.min' => 'La contraseña debe tener al menos 8 caracteres',
            'contrasena.max' => 'La contraseña debe tener como maximo 25 caracteres',
            'contrasena.regex' => 'La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial: @$!%*?&',
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
