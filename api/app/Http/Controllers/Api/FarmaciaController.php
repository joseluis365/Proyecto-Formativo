<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Farmacia;
use App\Http\Requests\StoreFarmaciaRequest;
use App\Http\Requests\UpdateFarmaciaRequest;
use App\Http\Resources\FarmaciaResource;

class FarmaciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Farmacia::with(['estado', 'empresa']);

        if ($request->filled('search')) {
            $query->where('nombre', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->has('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $farmacias = $query
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return FarmaciaResource::collection($farmacias);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFarmaciaRequest $request)
    {
        $farmacia = Farmacia::create($request->validated());

        return response()->json([
            'message' => 'Farmacia creada correctamente',
            'data' => new FarmaciaResource($farmacia)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFarmaciaRequest $request, $nit)
    {
        $farmacia = Farmacia::findOrFail($nit);

        $farmacia->update($request->validated());

        return response()->json([
            'message' => 'Farmacia actualizada correctamente',
            'data' => new FarmaciaResource($farmacia)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($nit)
    {
        $farmacia = Farmacia::findOrFail($nit);

        $farmacia->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Farmacia desactivada correctamente'
        ]);
    }
}
