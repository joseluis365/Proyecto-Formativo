<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoriaExamenRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'categoria' => 'required|string|max:100|unique:categoria_examen,categoria'
        ];
    }
}
