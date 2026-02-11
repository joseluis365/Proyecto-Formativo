<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LicenciaResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $maxPopular = $this->additional['max_popular'] ?? 0;
        return [
            'id' => $this->id_tipo_licencia,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'precio' => "COP " . number_format($this->precio, 0, ',', '.'),
            'precio_raw' => $this->precio,
            'duracion_meses' => $this->duracion_meses,
            'duracion' => $this->duracion_meses >= 12 
            ? ($this->duracion_meses / 12) . " AÑO(S)" 
            : $this->duracion_meses . " MESES",
            'id_estado' => $this->id_estado,
        

        'companies' => $this->empresa_licencias_count ?? 0,
        'popular' => (bool) $this->is_popular,
        ];
    }
}