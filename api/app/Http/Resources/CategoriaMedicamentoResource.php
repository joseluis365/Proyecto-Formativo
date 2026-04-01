<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar categorias de medicamento.
 */
class CategoriaMedicamentoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_categoria' => $this->id_categoria,
            'categoria' => $this->categoria,
            'id_estado' => $this->id_estado,
        ];
    }
}
