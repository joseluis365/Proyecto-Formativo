<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Events\SystemActivityEvent;
use App\Constants\RolConstants;

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
 * Obtiene médicos activos que no tengan cita en la fecha y hora proporcionada.
 */
public function medicosDisponibles(Request $request)
{
    $request->validate([
        'fecha' => 'required|date',
        'hora'  => 'required|date_format:H:i',
    ]);

    $fecha = $request->fecha;
    $hora  = $request->hora;

    $medicos = Usuario::with('especialidad')
        ->where('id_rol', RolConstants::MEDICO)
        ->where('id_estado', 1); // Activo

    // Filtrar por especialidad si se requiere (para agendamiento por tipo de cita)
    if ($request->filled('id_especialidad')) {
        $medicos->where('id_especialidad', $request->id_especialidad);
    }

    $medicos = $medicos->whereDoesntHave('medicoCitas', function ($query) use ($fecha, $hora) {
        $query->where('fecha', $fecha)
              ->where('hora_inicio', $hora)
              ->whereHas('estado', fn($q) => $q->where('nombre_estado', '!=', 'Cancelada'));
    })
    ->get();

    return response()->json($medicos->map(function ($medico) {
        $data = $medico instanceof \Illuminate\Database\Eloquent\Model 
            ? $medico->toArray() 
            : (array) $medico;

        $data['value'] = $medico->documento;
        $labelEspecialidad = $medico->especialidad->especialidad ?? 'Sin especialidad';
        $data['label'] = "Dr. {$medico->primer_nombre} {$medico->primer_apellido} - {$labelEspecialidad}";
        
        return $data;
    }));
}

    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        return response()->json(
            Usuario::with(['especialidad', 'consultorio'])->findOrFail($id)
        );
    }

    // 📌 CREAR
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $user = Usuario::create($data);

        $nombreCompleto = trim($user->primer_nombre . ' ' . $user->primer_apellido);
        event(new SystemActivityEvent(
            "Usuario creado: {$nombreCompleto}",
            'blue',
            'person_add',
            'admin-feed'
        ));

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

        $nombreCompleto = trim($user->primer_nombre . ' ' . $user->primer_apellido);
        event(new SystemActivityEvent(
            "Usuario editado: {$nombreCompleto}",
            'orange',
            'manage_accounts',
            'admin-feed'
        ));

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
        $user = Usuario::findOrFail($id);
        $nombreCompleto = trim($user->primer_nombre . ' ' . $user->primer_apellido);
        $user->delete();

        event(new SystemActivityEvent(
            "Usuario eliminado: {$nombreCompleto}",
            'red',
            'person_remove',
            'admin-feed'
        ));

        return response()->json([
            'message' => 'Usuario eliminado'
        ]);
    }
}
