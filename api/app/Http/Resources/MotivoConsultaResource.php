<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar motivos de consulta.
 */
class MotivoConsultaResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id_motivo' => $this->id_motivo,
            'motivo'    => $this->motivo,
            'id_estado' => $this->id_estado,
        ];
    }
}
