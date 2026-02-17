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
        $query->where('id_estado', $request->status);
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
        $data = $request->validated();
        $data['contrasena'] = \Illuminate\Support\Facades\Hash::make($data['contrasena']);


        
        $user = Usuario::create($data);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = Usuario::findOrFail($id);

        $data = $request->validate([
            'documento' => 'required|integer|regex:/^\d{1,10}$/|unique:usuario,documento,' . $id . ',documento',
            'nombre'   => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email'  => 'required|email|unique:usuario,email,' . $id . ',documento',
            'telefono' => 'required|numeric|regex:/^\d{1,10}$/|unique:usuario,telefono,' . $id . ',documento',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
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
