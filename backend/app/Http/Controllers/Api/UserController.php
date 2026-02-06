<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🔹 LISTAR USUARIOS
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // 🔹 CREAR USUARIO
    public function store(Request $request)
    {
        $request->validate([
            'documento' => 'required|integer|unique:usuario,documento',
            'nombre' => 'required|string|max:50',
            'apellido' => 'required|string|max:50',
            'email' => 'required|email|unique:usuario,email',
            'telefono' => 'nullable|string|max:30',
            'direccion' => 'nullable|string|max:150',
            'sexo' => 'required|in:Masculino,Femenino',
            'fecha_nacimiento' => 'required|date',
            'grupo_sanguineo' => 'required|string|max:3',
            'contrasena' => 'required|min:6',
            'registro_profesional' => 'nullable|string|max:50',
            'id_empresa' => 'nullable|integer',
            'id_rol' => 'required|integer',
            'id_estado' => 'required|integer',
        ]);

        $user = User::create([
            'documento' => $request->documento,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'sexo' => $request->sexo,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'grupo_sanguineo' => $request->grupo_sanguineo,
            'contrasena' => Hash::make($request->contrasena),
            'registro_profesional' => $request->registro_profesional,
            'id_empresa' => $request->id_empresa,
            'id_rol' => $request->id_rol,
            'id_estado' => $request->id_estado,
        ]);

        return response()->json($user, 201);
    }

    // 🔹 MOSTRAR USUARIO POR DOCUMENTO
    public function show($documento)
    {
        $user = User::find($documento);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user, 200);
    }

    // 🔹 ACTUALIZAR USUARIO
    public function update(Request $request, $documento)
    {
        $user = User::find($documento);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'email' => 'email|unique:usuario,email,' . $documento . ',documento',
            'sexo' => 'in:Masculino,Femenino',
            'fecha_nacimiento' => 'date',
            'contrasena' => 'nullable|min:6',
        ]);

        $user->fill($request->except('contrasena'));

        if ($request->contrasena) {
            $user->contrasena = Hash::make($request->contrasena);
        }

        $user->save();

        return response()->json($user, 200);
    }

    // 🔹 ELIMINAR USUARIO
    public function destroy($documento)
    {
        $user = User::find($documento);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente'], 200);
    }
}
