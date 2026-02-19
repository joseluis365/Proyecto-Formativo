<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Listar usuarios con filtros y paginación
     */
    public function index(Request $request)
    {
        $query = Usuario::with('especialidad');

        // 🔎 Filtro por rol
        if ($request->filled('id_rol')) {
            $query->where('id_rol', $request->id_rol);
        }

        // 🔎 Filtro por estado
        if ($request->filled('status')) {
            $query->where('id_estado', $request->status);
        }

        // 🔎 Búsqueda
        if ($request->filled('search')) {
            $search = trim((string) $request->search);

            $query->where(function ($q) use ($search) {
                $q->where('documento', 'ilike', "%{$search}%")
                  ->orWhere('nombre', 'ilike', "%{$search}%")
                  ->orWhere('apellido', 'ilike', "%{$search}%");
            });
        }

        $usuarios = $query->paginate(10);

        $totalPorRol = $request->filled('id_rol')
            ? Usuario::where('id_rol', $request->id_rol)->count()
            : Usuario::count();

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
     * Mostrar usuario específico
     */
    public function show($id)
    {
        return response()->json(
            Usuario::findOrFail($id)
        );
    }

    /**
     * Crear usuario
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        $user = Usuario::create($data);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'data' => $user
        ], 201);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, $id)
    {
        $user = Usuario::findOrFail($id);

        $rules = [
            'documento' => 'required|integer|regex:/^\d{1,10}$/|unique:usuario,documento,' . $id . ',documento',
            'nombre'   => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email'  => 'required|email|unique:usuario,email,' . $id . ',documento',
            'telefono' => 'required|numeric|regex:/^\d{1,10}$/|unique:usuario,telefono,' . $id . ',documento',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'id_estado' => 'required|exists:estado,id_estado',
            'id_rol' => 'required|exists:rol,id_rol',
        ];

        switch ((int) $request->id_rol) {

            // 🩺 MEDICO
            case 2:
                $rules['registro_profesional'] =
                    'required|numeric|regex:/^\d{1,10}$/|unique:usuario,registro_profesional,' . $id . ',documento';
                $rules['id_especialidad'] =
                    'required|exists:especialidad,id_especialidad';
                break;

            // 👤 PACIENTE
            case 4:
                $rules['sexo'] =
                    'required|in:Masculino,Femenino';
                $rules['grupo_sanguineo'] =
                    'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-';
                break;
        }

        $data = $request->validate($rules);

        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ]);
    }

    /**
     * Cambiar estado del usuario
     */
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

    /**
     * Eliminar usuario
     */
    public function destroy($id)
    {
        Usuario::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Usuario eliminado'
        ]);
    }
}
