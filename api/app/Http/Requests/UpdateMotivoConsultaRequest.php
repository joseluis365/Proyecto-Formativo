<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMotivoConsultaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('motivos_consulta') ?? $this->route('motivo_consulta') ?? $this->route('id') ?? $this->segment(3); // Depends on how I define the route. I'll use $this->route('id') because I will define the parameter as {id}
        
        return [
            'motivo' => 'required|string|max:100|unique:motivo_consulta,motivo,' . $id . ',id_motivo',
            'id_estado' => 'required|integer|exists:estados,id_estado'
        ];
    }
}
