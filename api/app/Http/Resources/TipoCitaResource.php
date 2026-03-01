<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TipoCitaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_tipo_cita' => $this->id_tipo_cita,
            'tipo' => $this->tipo,
            'id_estado' => $this->id_estado,
        ];
    }
}
