<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\MotivoConsulta;

class MotivoConsultaController extends Controller
{
    public function index()
    {
        $motivos = MotivoConsulta::whereHas('estado', function ($q) {
            $q->where('nombre_estado', 'Activo');
        })->get(['id_motivo as value', 'motivo as label']);

        return response()->json($motivos);
    }
}
