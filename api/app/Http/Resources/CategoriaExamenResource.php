<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar categorias de examen.
 */
class CategoriaExamenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_categoria_examen' => $this->id_categoria_examen,
            'categoria' => $this->categoria,
            'id_estado' => $this->id_estado,
            'requiere_ayuno' => (bool)$this->requiere_ayuno,
        ];
    }
}
