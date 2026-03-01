<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrioridadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_prioridad' => $this->id_prioridad,
            'prioridad' => $this->prioridad,
            'id_estado' => $this->id_estado,
        ];
    }
}
