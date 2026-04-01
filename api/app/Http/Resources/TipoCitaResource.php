<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar tipos de cita.
 */
class TipoCitaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_tipo_cita' => $this->id_tipo_cita,
            'tipo' => $this->tipo,
            'id_estado' => $this->id_estado,
            'id_especialidad' => $this->id_especialidad,
            'especialidad' => $this->especialidad ? $this->especialidad->especialidad : null,
            'acceso_directo' => (bool)$this->acceso_directo,
        ];
    }
}
