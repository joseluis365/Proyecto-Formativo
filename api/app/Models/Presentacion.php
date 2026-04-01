<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Presentacion.
 * Define presentaciones comerciales de medicamentos.
 */
class Presentacion extends Model
{
    protected $table = 'presentacion_medicamento';
    protected $primaryKey = 'id_presentacion';
    public $timestamps = true;

    protected $fillable = [
        'id_medicamento',
        'id_concentracion',
        'id_forma_farmaceutica'
    ];

    public function medicamento()
    {
        return $this->belongsTo(Medicamento::class, 'id_medicamento', 'id_medicamento');
    }

    public function concentracion()
    {
        return $this->belongsTo(Concentracion::class, 'id_concentracion', 'id_concentracion');
    }

    public function formaFarmaceutica()
    {
        return $this->belongsTo(FormaFarmaceutica::class, 'id_forma_farmaceutica', 'id_forma');
    }
}
