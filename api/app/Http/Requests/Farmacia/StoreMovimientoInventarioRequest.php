<?php

namespace App\Http\Requests\Farmacia;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovimientoInventarioRequest extends FormRequest
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
            'id_presentacion' => 'required|integer|exists:presentacion_medicamento,id_presentacion',
            'cantidad' => 'required|integer|min:1|max:1000000',
            // La fecha no puede ser anterior a "hoy" (Y-m-d)
            'fecha_vencimiento' => 'required|date|after_or_equal:today',
            'motivo' => ['required', 'string', 'min:5', 'max:500', 'regex:/^[\w\s.,;:()áéíóúÁÉÍÓÚñÑüÜ-]+$/u']
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'id_presentacion.required' => 'Debe seleccionar un medicamento válido.',
            'id_presentacion.exists' => 'El medicamento seleccionado no existe en el sistema.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'cantidad.max' => 'La cantidad ingresada es demasiado alta.',
            'fecha_vencimiento.required' => 'La fecha de vencimiento es obligatoria.',
            'fecha_vencimiento.after_or_equal' => 'El medicamento no puede estar ya vencido (fecha debe ser igual o posterior a hoy).',
            'motivo.required' => 'El motivo u observación es obligatorio.',
            'motivo.min' => 'El motivo debe tener al menos 5 caracteres.',
            'motivo.regex' => 'El motivo contiene caracteres no permitidos.'
        ];
    }
}
