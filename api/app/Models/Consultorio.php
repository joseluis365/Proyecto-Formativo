<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultorio extends Model
{
    use HasFactory;

    protected $table = 'consultorio';
    protected $primaryKey = 'id_consultorio';
    public $timestamps = false;

    protected $fillable = [
        'id_consultorio',
        'numero_consultorio'
    ];
}
