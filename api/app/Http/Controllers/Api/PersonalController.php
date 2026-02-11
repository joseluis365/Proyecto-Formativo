<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Http\Requests\StoreUserRequest;

class PersonalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = Usuario::query();

    // Filtro por rol
    if ($request->filled('id_rol')) {
        $query->where('id_rol', $request->id_rol);
    }
     
     
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Búsqueda
    if ($request->filled('search')) {
        $search = trim((string) $request->search);

        $query->where(function ($q) use ($search) {

            // 👉 ID (numérico)
            if (is_numeric($search)) {
                $q->where('id', (int) $search);
            }

            // 👉 Nombre (texto)
            $q->orWhere('name', 'like', "%{$search}%");
        });
    }

    return response()->json([
        'total' => $query->count(),
        'data' => $query->get()
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        return response()->json(
            Usuario::findOrFail($id)
        );
    }

    // 📌 CREAR
    public function store(StoreUserRequest $request)
    {
    $user = Usuario::create($request->validated());

    return response()->json([
        'message' => 'Usuario creado correctamente',
        'data' => $user
    ], 201);
}

    public function update(Request $request, $id)
    {
        $user = Usuario::findOrFail($id);

        $data = $request->validate([
            'documento' => 'required|integer|unique:usuario,documento,' . $id,
            'nombre'   => 'required|string|max:255',
            'email'  => 'required|email|unique:usuario,email,' . $id,
            'id_estado' => 'required|in:1,2',
            'id_rol' => 'required|integer',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ]);
    }

    // 📌 ELIMINAR
    public function destroy($id)
    {
        Usuario::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Usuario eliminado'
        ]);
    }
}
