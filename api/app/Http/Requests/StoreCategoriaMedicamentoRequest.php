<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class StoreCategoriaMedicamentoRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'categoria' => ['required', 'string', 'max:100', new UniqueIgnoreCase('categoria_medicamento', 'categoria')]
        ];
    }
}
