<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo MotivoConsulta.
 * Catalogo de motivos usados al agendar y atender citas.
 */
class MotivoConsulta extends Model
{
    use HasFactory;

    protected $table = 'motivo_consulta';
    protected $primaryKey = 'id_motivo';

    protected $fillable = [
        'motivo',
        'id_estado',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
