<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Licencia;
use Carbon\Carbon;

class StoreEmpresaLicenciaRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ajusta según tu lógica de autorización
    }

    public function rules()
    {
        return [
            'nit' => [
                'required',
                'string',
                Rule::exists('empresa', 'nit') // valida que la empresa exista
            ],
            'id_tipo_licencia' => [
                'required',
                'integer',
                'regex:/^[1-9]+$/',
                Rule::exists('tipo_licencia', 'id_tipo_licencia')
            ],
            // estos campos pueden venir del frontend, pero se validan contra la BD
            'precio' => ['numeric', 'required'],
            'duracion_meses' => ['required', 'integer'],
            'fecha_inicio' => ['date', 'required'],
            'fecha_fin' => ['date', 'required'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $licencia = Licencia::find($this->id_tipo_licencia);

            if ($licencia) {
                // Validar precio
                if ($this->precio != $licencia->precio) {
                    $validator->errors()->add('precio', 'El precio no corresponde con la licencia seleccionada.');
                }

                // Validar duración
                if ($this->duracion_meses != $licencia->duracion_meses) {
                    $validator->errors()->add('duracion_meses', 'La duración no corresponde con la licencia seleccionada.');
                }

                // Validar fecha fin si se envía
                if ($this->filled('fecha_inicio') && $this->filled('fecha_fin')) {
                    $fechaFinEsperada = Carbon::parse($this->fecha_inicio)
                        ->addMonths($licencia->duracion_meses)
                        ->toDateString();

                    if ($this->fecha_fin != $fechaFinEsperada) {
                        $validator->errors()->add('fecha_fin', 'La fecha fin no corresponde con la duración de la licencia.');
                    }
                }
            }
        });
    }

    public function messages()
    {
        return [
            'nit.required' => 'Debe ingresar el NIT de la empresa.',
            'nit.exists' => 'La empresa no existe.',

            'id_tipo_licencia.regex' => 'El tipo de licencia debe ser un número valido.',
            'id_tipo_licencia.required' => 'Debe seleccionar un tipo de licencia.',

            'id_tipo_licencia.exists' => 'El tipo de licencia no existe.',

            'precio.required' => 'Debe ingresar el precio.',
            'precio.numeric' => 'El precio debe ser numérico.',

            'duracion_meses.required' => 'Debe indicar la duración en meses.',
            'duracion_meses.integer' => 'La duración debe ser un número entero.',

            'fecha_inicio.date' => 'La fecha de inicio no es válida.',
            'fecha_inicio.required' => 'Debe ingresar la fecha de inicio.',

            'fecha_fin.date' => 'La fecha de fin no es válida.',
            'fecha_fin.required' => 'Debe ingresar la fecha de fin.',
        ];
    }
}