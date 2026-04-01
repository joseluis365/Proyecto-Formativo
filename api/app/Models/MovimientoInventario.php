<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo MovimientoInventario.
 * Traza entradas y salidas de inventario por medicamento/lote.
 */
class MovimientoInventario extends Model
{
    protected $table = 'movimiento_inventario';
    protected $primaryKey = 'id_movimiento';
    public $timestamps = true;

    protected $fillable = [
        'id_lote',
        'tipo_movimiento',
        'cantidad',
        'fecha',
        'documento',
        'motivo',
        'id_dispensacion',
        'nit_farmacia'
    ];

    public function loteMedicamento()
    {
        return $this->belongsTo(LoteMedicamento::class, 'id_lote', 'id_lote');
    }

    public function usuarioDocumento()
    {
        return $this->belongsTo(Usuario::class, 'documento', 'documento');
    }

    public function dispensacion()
    {
        return $this->belongsTo(Dispensacion::class, 'id_dispensacion', 'id_dispensacion');
    }

    /**
     * Relación indirecta con la farmacia a través del lote.
     */
    public function farmacia()
    {
        return $this->hasOneThrough(
            Farmacia::class,
            LoteMedicamento::class,
            'id_lote', // FK en LoteMedicamento
            'nit',     // FK en Farmacia (nit)
            'id_lote', // Local key en MovimientoInventario
            'nit_farmacia' // Local key en LoteMedicamento
        );
    }
}
