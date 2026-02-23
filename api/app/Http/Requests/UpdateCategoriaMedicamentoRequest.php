<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoriaMedicamentoRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'categoria' => 'required|string|max:100|unique:categoria_medicamento,categoria,' . $id . ',id_categoria'
        ];
    }
}
