<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoteMedicamento extends Model
{
    protected $table = 'lote_medicamento';
    protected $primaryKey = 'id_lote';
    public $timestamps = true;

    protected $fillable = [
        'id_presentacion',
        'nit_farmacia',
        'fecha_vencimiento',
        'stock_actual'
    ];

    public function presentacion()
    {
        return $this->belongsTo(Presentacion::class, 'id_presentacion', 'id_presentacion');
    }

    public function farmacia()
    {
        return $this->belongsTo(Farmacia::class, 'nit_farmacia', 'nit');
    }

    public function movimientosInventario()
    {
        return $this->hasMany(MovimientoInventario::class, 'id_lote', 'id_lote');
    }
}
