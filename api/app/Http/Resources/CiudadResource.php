<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CiudadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'codigo_postal'   => $this->codigo_postal,
            'nombre'          => $this->nombre,
            'id_departamento' => $this->id_departamento,
            'departamento_nombre' => $this->departamento?->nombre,
            'id_estado'       => $this->id_estado,
        ];
    }
}
