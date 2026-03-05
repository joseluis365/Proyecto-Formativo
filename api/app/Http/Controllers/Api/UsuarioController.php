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


    $perPage = $request->input('per_page', 15);
    $usuarios = $query->paginate($perPage);

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
 * Obtiene médicos activos que no tengan cita en la fecha y hora proporcionada.
 */
public function medicosDisponibles(Request $request)
{
    $request->validate([
        'fecha' => 'required|date',
        'hora' => 'required|date_format:H:i',
    ]);

    $fecha = $request->fecha;
    $hora = $request->hora;

    // Buscamos el ID del rol Médico dinámicamente
    $rolMedico = \App\Models\Rol::where('tipo_usu', 'MEDICO')->first();
    if (!$rolMedico) return response()->json([]);

    $medicos = Usuario::with('especialidad')
        ->where('id_rol', $rolMedico->id_rol)
        ->where('id_estado', 1) // Activo
        ->whereDoesntHave('medicoCitas', function ($query) use ($fecha, $hora) {
            $query->where('fecha', $fecha)
                  ->where('hora_inicio', $hora)
                  ->where('id_estado', '!=', 4); // No cancelada (4 = Cancelada según seeder)
        })
        ->get();

    return response()->json($medicos->map(function ($medico) {
        return [
            'value' => $medico->documento,
            'label' => "Dr. {$medico->primer_nombre} {$medico->primer_apellido} - " . ($medico->especialidad->especialidad ?? 'Sin especialidad'),
        ];
    }));
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
        // No se hashea aquí: el modelo tiene un mutator setContrasenaAttribute
        // que hashea la contraseña automáticamente al asignarla
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
