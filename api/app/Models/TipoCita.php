<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCita extends Model
{
    use HasFactory;

    protected $table = 'tipo_cita';
    protected $primaryKey = 'id_tipo_cita';

    protected $fillable = [
        'tipo',
        'id_estado',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
