<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\UniqueIgnoreCase;

class StoreTipoCitaRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'tipo' => ['required', 'string', 'max:50', new UniqueIgnoreCase('tipo_cita', 'tipo')]
        ];
    }
}
