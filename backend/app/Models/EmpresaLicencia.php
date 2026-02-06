<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Empresa;
use App\Models\TipoLicencia;
use App\Models\Estado;

class EmpresaLicencia extends Model
{
    use HasFactory;

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

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'nit', 'nit');
    }

    public function tipoLicencia()
    {
        return $this->belongsTo(TipoLicencia::class, 'id_tipo_licencia', 'id_tipo_licencia');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
