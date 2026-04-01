<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Ciudad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Controlador de ubicaciones.
 * Gestiona datos geograficos (departamentos/ciudades) para formularios y filtros.
 */
class LocationController extends Controller
{
    public function getDepartamentos()
    {
        return response()->json(Cache::remember('departamentos_all', 86400, function () {
            return Departamento::orderBy('nombre')->get();
        }));
    }

    public function getCiudades($departamentoId)
    {
        return response()->json(Cache::remember("ciudades_dep_{$departamentoId}", 86400, function () use ($departamentoId) {
            return Ciudad::where('id_departamento', $departamentoId)->orderBy('nombre')->get();
        }));
    }
}
