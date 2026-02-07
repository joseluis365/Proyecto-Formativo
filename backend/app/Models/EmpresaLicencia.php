<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaLicencia extends Model
{
    protected $table = 'empresa_licencia';

    protected $fillable = [
        'nit',
        'id_tipo_licencia',
        'fecha_inicio',
        'fecha_fin',
        'id_estado',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'nit', 'nit');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
