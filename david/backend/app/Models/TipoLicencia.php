<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Estado;
use App\Models\EmpresaLicencia;

class TipoLicencia extends Model
{
    use HasFactory;

    protected $table = 'tipo_licencia';
    protected $primaryKey = 'id_tipo_licencia';

    protected $fillable = [
        'tipo',
        'descripcion',
        'duracion_meses',
        'precio',
        'id_estado',
    ];

    protected $casts = [
        'duracion_meses' => 'integer',
        'precio' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function licenciasEmpresa()
    {
        return $this->hasMany(EmpresaLicencia::class, 'id_tipo_licencia', 'id_tipo_licencia');
    }
}
