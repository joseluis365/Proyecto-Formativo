<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class UpdateLicenciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('licencium');

        return [
            'tipo' => ['required', 'regex:/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+)*$/', 'string', new UniqueIgnoreCase('tipo_licencia', 'tipo', $id, 'id_tipo_licencia'), 'min:3', 'max:40'],
            'descripcion' => ['required', 'regex:/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+)*$/', 'string', 'min:10', 'max:250'],
            'precio' => ['required', 'numeric', 'min:100000', 'max:999999999'],
            'duracion_meses' => ['required', 'numeric', 'min:3', 'max:99'],
            'id_estado' => ['required', 'regex:/^[1-9][0-9]*$/', 'digits_between:1,2', 'exists:estado,id_estado'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.required' => 'El tipo es obligatorio',
            'tipo.regex' => 'El tipo debe contener al menos una letra y no puede contener caracteres especiales',
            'tipo.unique' => 'El tipo ya existe',
            'tipo.min' => 'El tipo debe tener al menos 3 caracteres',
            'tipo.max' => 'El tipo debe tener menos de 40 caracteres',

            'descripcion.required' => 'La descripcion es obligatoria',
            'descripcion.regex' => 'La descripcion debe contener al menos una letra y no puede contener caracteres especiales',
            'descripcion.min' => 'La descripcion debe tener al menos 10 caracteres',
            'descripcion.max' => 'La descripcion debe tener menos de 250 caracteres',

            'precio.required' => 'El precio es obligatorio',
            'precio.numeric' => 'El precio debe ser un número valido',
            'precio.min' => 'El precio mínimo permitido es de $100.000 COP',
            'precio.max' => 'El precio excede el máximo permitido',

            'duracion_meses.required' => 'La duracion es obligatoria',
            'duracion_meses.numeric' => 'La duracion debe ser un número valido',
            'duracion_meses.min' => 'La duracion en meses debe ser mínimo 3',
            'duracion_meses.max' => 'La duracion en meses debe ser menor a 100',

            'id_estado.required' => 'El estado es obligatorio',
            'id_estado.regex' => 'El estado debe ser un número valido',
            'id_estado.exists' => 'El estado no existe',
            'id_estado.digits_between' => 'El estado debe tener entre 1 y 2 dígitos',
        ];
    }
}
