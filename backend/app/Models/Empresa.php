<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Usuario;
use App\Models\EmpresaLicencia;
use App\Models\Estado;

class Empresa extends Model
{
    use HasFactory;

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

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'nit', 'nit');
    }

    public function licencias()
    {
        return $this->hasMany(EmpresaLicencia::class, 'nit', 'nit');
    }

    public function licenciaActiva()
    {
        return $this->hasOne(EmpresaLicencia::class, 'nit', 'nit')
            ->whereHas('estado', function ($q) {
                $q->where('nombre_estado', 'ACTIVA');
            })
            ->whereDate('fecha_inicio', '<=', now())
            ->whereDate('fecha_fin', '>=', now());
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
