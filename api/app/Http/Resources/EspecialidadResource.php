<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EspecialidadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_especialidad' => $this->id_especialidad,
            'especialidad' => $this->especialidad,
            'id_estado' => $this->id_estado,
        ];
    }
}
