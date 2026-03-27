<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTipoDocumentoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tipo_documento' => 'required|string|max:100|unique:tipo_documento,tipo_documento',
            'id_estado' => 'nullable|integer|exists:estados,id_estado'
        ];
    }
}
