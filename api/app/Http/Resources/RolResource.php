<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RolResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_rol'    => $this->id_rol,
            'tipo_usu'  => $this->tipo_usu,
            'id_estado' => $this->id_estado,
        ];
    }
}
