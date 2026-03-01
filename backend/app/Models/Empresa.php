<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Empresa extends Model
{
    protected $table = 'empresa';
    protected $primaryKey = 'nit';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nit',
        'nombre',
        'email_contacto',
        'telefono',
        'direccion',
        'documento_representante',
        'nombre_representante',
        'telefono_representante',
        'email_representante',
        'id_ciudad',
        'id_estado',
    ];

    // 🔗 Relación con licencias
    public function licencias()
    {
        return $this->hasMany(EmpresaLicencia::class, 'nit', 'nit');
    }

    // ✅ Licencia vigente
    public function licenciaVigente()
    {
        return $this->licencias()
            ->where('fecha_inicio', '<=', Carbon::today())
            ->where('fecha_fin', '>=', Carbon::today())
            ->whereHas('estado', function ($q) {
                $q->where('nombre_estado', 'Activo');
            })
            ->first();
    }

    // 🔗 Estado de la empresa
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
