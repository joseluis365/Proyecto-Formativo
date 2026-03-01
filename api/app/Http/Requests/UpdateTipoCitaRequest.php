<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoCitaRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'tipo' => 'required|string|max:50|unique:tipo_cita,tipo,' . $id . ',id_tipo_cita'
        ];
    }
}
