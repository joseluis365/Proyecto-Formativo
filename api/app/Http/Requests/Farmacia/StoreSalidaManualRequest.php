<?php

namespace App\Http\Requests\Farmacia;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalidaManualRequest extends FormRequest
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
            'id_lote' => 'required|integer|exists:lote_medicamento,id_lote',
            'cantidad' => 'required|integer|min:1|max:1000000',
            'motivo' => ['required', 'string', 'min:5', 'max:500', 'regex:/^[\w\s.,;:()áéíóúÁÉÍÓÚñÑüÜ-]+$/u']
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'id_lote.required' => 'Debe seleccionar un lote válido.',
            'id_lote.exists' => 'El lote seleccionado no existe en el sistema.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
            'motivo.required' => 'El motivo es obligatorio.',
            'motivo.min' => 'El motivo debe tener al menos 5 caracteres.',
            'motivo.regex' => 'El motivo contiene caracteres no permitidos.'
        ];
    }
}
