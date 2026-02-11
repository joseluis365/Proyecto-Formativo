<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaLicencia extends Model
{
    protected $table = 'empresa_licencia';
    protected $primaryKey = 'id_empresa_licencia';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id_empresa_licencia',
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

    public function tipoLicencia()
    {
        return $this->belongsTo(Licencia::class, 'id_tipo_licencia', 'id_tipo_licencia');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
