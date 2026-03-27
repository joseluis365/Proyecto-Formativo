<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoDocumentoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('tipos_documento') ?? $this->route('tipo_documento') ?? $this->route('id') ?? $this->segment(3);
        
        return [
            'tipo_documento' => 'required|string|max:100|unique:tipo_documento,tipo_documento,' . $id . ',id_tipo_documento',
            'id_estado' => 'required|integer|exists:estados,id_estado'
        ];
    }
}
