<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Activity.
 * Bitacora de eventos y actividad del sistema.
 */
class Activity extends Model
{
    protected $table = 'activities';
    protected $fillable = [
        'title',
        'type',
        'icon',
        'channel_name',
    ];
}
