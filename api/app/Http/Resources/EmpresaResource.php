<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class EmpresaResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        $licencia = $this->licenciaActual;
    $hoy = Carbon::now()->startOfDay();
    
    $estadoCalculado = 3; 
    $fechaExpiracion = 'Sin licencia';

    if ($licencia) {
        $fechaFin = Carbon::parse($licencia->fecha_fin)->startOfDay();
        $fechaExpiracion = $licencia->fecha_fin;

        $estadoCalculado = $licencia->id_estado;
    }

        return [
            'nit' => $this->nit,
            'nombre' => $this->nombre,
            'email_contacto' => $this->email_contacto,
            'telefono' => $this->telefono,
            'direccion' => $this->direccion,
            'id_estado' => $estadoCalculado,
        ];
    }
}
