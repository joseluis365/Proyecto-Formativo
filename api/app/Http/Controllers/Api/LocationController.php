<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Ciudad;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getDepartamentos()
    {
        return response()->json(Departamento::orderBy('nombre')->get());
    }

    public function getCiudades($departamentoId)
    {
        return response()->json(Ciudad::where('id_departamento', $departamentoId)->orderBy('nombre')->get());
    }
}
