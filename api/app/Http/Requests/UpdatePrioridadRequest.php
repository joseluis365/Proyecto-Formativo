<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrioridadRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'prioridad' => 'required|string|max:30|unique:prioridad,prioridad,' . $id . ',id_prioridad'
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'prioridad.required' => 'El nombre de la prioridad es obligatorio.',
            'prioridad.unique' => 'Ese nombre de prioridad ya está en uso.',
            'prioridad.max' => 'La prioridad no puede tener más de 30 caracteres.'
        ];
    }
}
