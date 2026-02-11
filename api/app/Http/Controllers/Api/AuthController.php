<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Empresa;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->contrasena)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        // 🔹 VALIDACIÓN DE LICENCIA
        // Verificar si el usuario pertenece a una empresa (tiene NIT)
        if ($user->nit) {
            $empresa = Empresa::with('licenciaActual')->find($user->nit);

            if ($empresa) {
                $licencia = $empresa->licenciaActual;

                if (!$licencia) {
                    return response()->json([
                        'message' => 'Su empresa no tiene una licencia asignada. Contacte al administrador.',
                    ], 403);
                }

                if ($licencia->id_estado != 1) { // 1 = Activa
                    $estadoTexto = match ($licencia->id_estado) {
                        2 => 'Inactiva',
                        3 => 'Sin Licencia',
                        4 => 'Por vencer',
                        5 => 'Vencida',
                        6 => 'Bloqueada (Pendiente de Pago)',
                        default => 'Desconocido',
                    };

                    return response()->json([
                        'message' => "Acceso denegado. La licencia de su empresa está: $estadoTexto.",
                    ], 403);
                }
            }
        }

        // Si pasa todas las validaciones, generar token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // Revocar token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
