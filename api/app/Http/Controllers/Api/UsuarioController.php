<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = Usuario::with('especialidad');

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
        $q->where('documento', 'ilike', "%{$search}%")
          ->orWhere('primer_nombre', 'ilike', "%{$search}%")
          ->orWhere('segundo_nombre', 'ilike', "%{$search}%")
          ->orWhere('primer_apellido', 'ilike', "%{$search}%")
          ->orWhere('segundo_apellido', 'ilike', "%{$search}%");
    });
}


    $usuarios = $query->paginate(10);

    $totalPorRol = Usuario::where('id_rol', $request->id_rol)->count();


    return response()->json([
        'total' => $usuarios->total(),
        'totalPorRol' => $totalPorRol,
        'data' => $usuarios->items(),
        'current_page' => $usuarios->currentPage(),
        'last_page' => $usuarios->lastPage(),
        'per_page' => $usuarios->perPage()

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

    public function update(UpdateUserRequest $request, $id)
    {
        $user = Usuario::findOrFail($id);

        $data = $request->validated();
        
        unset($data['documento']);
        unset($data['contrasena']);

        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ]);
    }

    public function updateEstado(Request $request, $id)
    {
        $user = Usuario::findOrFail($id);

        $data = $request->validate([
            'id_estado' => 'required|exists:estado,id_estado',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Estado del usuario actualizado correctamente',
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
