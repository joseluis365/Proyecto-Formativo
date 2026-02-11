<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;

class PersonalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = User::query();

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
            User::findOrFail($id)
        );
    }

    // 📌 CREAR
    public function store(StoreUserRequest $request)
    {
    $user = User::create($request->validated());

    return response()->json([
        'message' => 'Usuario creado correctamente',
        'data' => $user
    ], 201);
}

    // 📌 ACTUALIZAR
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'id' => 'required|integer|unique:users,id,' . $id,
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:users,email,' . $id,
            'status' => 'required|in:ACTIVO,INACTIVO',
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
        User::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Usuario eliminado'
        ]);
    }
}
