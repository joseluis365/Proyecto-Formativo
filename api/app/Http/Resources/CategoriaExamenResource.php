<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriaExamenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_categoria_examen' => $this->id_categoria_examen,
            'categoria' => $this->categoria,
            'id_estado' => $this->id_estado,
        ];
    }
}
