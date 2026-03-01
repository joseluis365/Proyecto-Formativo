<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Especialidad;
use App\Http\Requests\StoreEspecialidadRequest;
use App\Http\Requests\UpdateEspecialidadRequest;
use App\Http\Resources\EspecialidadResource;

class EspecialidadesController extends Controller
{
    public function index(Request $request)
    {
        $query = Especialidad::with('estado');

        if ($request->filled('search')) {
            $query->where('especialidad', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $especialidades = $query
            ->orderBy('especialidad', 'asc')
            ->paginate(10);

        return EspecialidadResource::collection($especialidades);
    }

    public function select(Request $request)
    {
        $query = Especialidad::query();

        if (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        return response()->json(
            $query->select('id_especialidad as value', 'especialidad as label')
                ->orderBy('especialidad', 'asc')
                ->get()
        );
    }

    public function store(StoreEspecialidadRequest $request)
    {
        $especialidad = Especialidad::create([
            'especialidad' => $request->especialidad,
            'id_estado' => 1
        ]);

        return response()->json([
            'message' => 'Especialidad creada correctamente',
            'data' => new EspecialidadResource($especialidad)
        ], 201);
    }

    public function update(UpdateEspecialidadRequest $request, $id)
    {
        $especialidad = Especialidad::findOrFail($id);

        $especialidad->update([
            'especialidad' => $request->especialidad
        ]);

        return response()->json([
            'message' => 'Especialidad actualizada correctamente',
            'data' => new EspecialidadResource($especialidad)
        ]);
    }

    public function destroy($id)
    {
        $especialidad = Especialidad::findOrFail($id);

        $especialidad->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Especialidad desactivada correctamente'
        ]);
    }
}
