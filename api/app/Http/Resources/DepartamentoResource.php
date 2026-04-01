<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar departamentos.
 */
class DepartamentoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'codigo_DANE' => $this->codigo_DANE,
            'nombre'      => $this->nombre,
            'id_estado'   => $this->id_estado,
        ];
    }
}
