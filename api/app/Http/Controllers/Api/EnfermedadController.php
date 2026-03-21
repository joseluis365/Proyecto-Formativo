<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enfermedad;

class EnfermedadController extends Controller
{
    /**
     * Busca enfermedades en la base de datos (CIE-11) limitando los resultados.
     */
    public function buscar(Request $request)
    {
        $query = $request->query('q', '');
        $limit = $request->query('limit', 15);

        // Prevenimos límites exagerados accidentalmente por el frontend
        if ($limit > 5000) {
            $limit = 5000;
        }

        $enfermedades = Enfermedad::select('codigo_icd', 'nombre', 'descripcion')
            ->when($query !== '', function ($q) use ($query) {
                return $q->where('nombre', 'ILIKE', "%{$query}%")
                         ->orWhere('codigo_icd', 'ILIKE', "%{$query}%");
            })
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enfermedades
        ]);
    }

    public function index(Request $request)
    {
        $query = Enfermedad::query();

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('nombre', 'ILIKE', "%{$search}%")
                  ->orWhere('codigo_icd', 'ILIKE', "%{$search}%");
        }

        $perPage = $request->query('per_page', 15);
        $enfermedades = $query->orderBy('codigo_icd', 'asc')->paginate($perPage);

        return response()->json($enfermedades);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_icd' => 'required|string|max:50|unique:enfermedades,codigo_icd',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $enfermedad = Enfermedad::create($validated);

        return response()->json([
            'message' => 'Enfermedad creada con éxito',
            'data' => $enfermedad
        ], 201);
    }

    public function update(Request $request, $codigo_icd)
    {
        $enfermedad = Enfermedad::where('codigo_icd', $codigo_icd)->firstOrFail();

        $validated = $request->validate([
            'codigo_icd' => 'sometimes|string|max:50|unique:enfermedades,codigo_icd,'.$enfermedad->codigo_icd.',codigo_icd',
            'nombre' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $enfermedad->update($validated);

        return response()->json([
            'message' => 'Enfermedad actualizada con éxito',
            'data' => $enfermedad
        ]);
    }

    public function destroy($codigo_icd)
    {
        $enfermedad = Enfermedad::where('codigo_icd', $codigo_icd)->firstOrFail();
        $enfermedad->delete();

        return response()->json([
            'message' => 'Enfermedad eliminada con éxito'
        ]);
    }
}
