<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultorio;
use Illuminate\Http\Request;

class ConsultorioController extends Controller
{
    /**
     * Listado de todos los consultorios.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Consultorio::all()
        ]);
    }

    /**
     * Listado de consultorios disponibles (no asignados a ningún médico).
     */
    public function disponibles(Request $request)
    {
        $includeId = $request->query('include_id');
        
        $asignados = \App\Models\Usuario::whereNotNull('id_consultorio')
            ->when($includeId, function($q) use ($includeId) {
                return $q->where('id_consultorio', '!=', $includeId);
            })
            ->pluck('id_consultorio')
            ->toArray();

        $disponibles = Consultorio::whereNotIn('id_consultorio', $asignados)->get();

        return response()->json([
            'success' => true,
            'data' => $disponibles
        ]);
    }
}
