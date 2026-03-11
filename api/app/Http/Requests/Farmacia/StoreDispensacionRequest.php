<?php

namespace App\Http\Requests\Farmacia;

use Illuminate\Foundation\Http\FormRequest;

class StoreDispensacionRequest extends FormRequest
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
            'id_detalle_receta' => 'required|integer|exists:receta_detalle,id_detalle_receta',
            'cantidad' => 'required|integer|min:1|max:1000'
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'id_detalle_receta.required' => 'El detalle de la receta es obligatorio.',
            'id_detalle_receta.exists' => 'El detalle de la receta no existe.',
            'cantidad.required' => 'La cantidad a dispensar es obligatoria.',
            'cantidad.min' => 'La cantidad debe ser mínimo 1.',
            'cantidad.max' => 'La cantidad es anormalmente alta.'
        ];
    }
}
