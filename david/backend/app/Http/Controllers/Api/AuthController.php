<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1️⃣ Validación
        $request->validate([
            'email' => 'required|email',
            'contrasena' => 'required|string',
        ]);

        // 2️⃣ Buscar usuario por email
        $user = User::where('email', $request->email)->first();

        // 3️⃣ Validar credenciales
        if (!$user || !Hash::check($request->contrasena, $user->contrasena)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas.'],
            ]);
        }

        // 4️⃣ Validar estado del usuario
        if ($user->estado->nombre_estado !== 'Activo') {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], 403);
        }

        // 5️⃣ Generar token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6️⃣ Respuesta para React
        return response()->json([
            'token' => $token,
            'usuario' => [
                'documento' => $user->documento,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
            ],
            'rol' => $user->rol->tipo_usu,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
