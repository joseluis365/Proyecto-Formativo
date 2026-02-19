<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Empresa;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ]);
            

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->contrasena)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        //VALIDACIÓN DE LICENCIA
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

                if ($licencia->id_estado != 1) {
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
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    /**
     * Paso 1: Enviar código de recuperación
     */
    public function sendRecoveryCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Correo no encontrado'], 404);
        }

        $code = random_int(100000, 999999);

        // Guardar código de recuperación por 10 minutos
        Cache::put('user_recovery_' . $request->email, $code, now()->addMinutes(10));

        try {
            Mail::raw(
                "Tu código de recuperación es: {$code}. Válido por 10 minutos.",
                function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('Recuperación de Contraseña - EPS');
                }
            );
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error enviando correo'], 500);
        }

        return response()->json(['message' => 'Código enviado']);
    }

    /**
     * Paso 2: Verificar código de recuperación
     */
    public function verifyRecoveryCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric'
        ]);

        $cachedCode = Cache::get('user_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json(['message' => 'Código inválido o expirado'], 400);
        }

        return response()->json(['message' => 'Código correcto']);
    }

    /**
     * Paso 3: Restablecer contraseña
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric',
            'password' => 'required|string|min:8|max:25|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'code.required' => 'El código es obligatorio.',
            'code.numeric' => 'El código debe ser numérico.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.max' => 'La contraseña debe tener como maximo 25 caracteres.',
            'password.regex' => 'La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial: @$!%*?&',
        ]);

        // Verificar código nuevamente por seguridad
        $cachedCode = Cache::get('user_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json(['message' => 'Sesión expirada o código inválido'], 400);
        }

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->contrasena = Hash::make($request->password);
        $user->save();

        // Eliminar código usado
        Cache::forget('user_recovery_' . $request->email);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
