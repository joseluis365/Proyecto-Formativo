<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recurso API para serializar tipos de documento.
 */
class TipoDocumentoResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id_tipo_documento' => $this->id_tipo_documento,
            'tipo_documento'    => $this->tipo_documento,
            'id_estado'         => $this->id_estado,
        ];
    }
}
