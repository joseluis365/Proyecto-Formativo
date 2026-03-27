<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMotivoConsultaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'motivo' => 'required|string|max:100|unique:motivo_consulta,motivo',
            'id_estado' => 'nullable|integer|exists:estados,id_estado'
        ];
    }
}
