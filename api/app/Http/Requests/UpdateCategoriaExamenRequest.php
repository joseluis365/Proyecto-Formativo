<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoriaExamenRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'categoria' => 'required|string|max:100|unique:categoria_examen,categoria,' . $id . ',id_categoria_examen'
        ];
    }
}
