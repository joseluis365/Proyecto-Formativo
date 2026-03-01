<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmacia extends Model
{
    use HasFactory;

    protected $table = 'farmacia';
    protected $primaryKey = 'nit';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nit',
        'nombre',
        'direccion',
        'telefono',
        'email',
        'nombre_contacto',
        'horario_apertura',
        'horario_cierre',
        'abierto_24h',
        'nit_empresa',
        'id_estado',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'nit_empresa', 'nit');
    }
}
