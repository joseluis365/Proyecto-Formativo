<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Empresa;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\SendRecoveryCodeRequest;
use App\Http\Requests\Auth\VerifyRecoveryCodeRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;

class AuthController extends Controller
{
    /**
     * Inicio de sesión para usuarios generales
     */
    public function login(LoginRequest $request)
    {
        $user = Usuario::with(['especialidad', 'consultorio'])->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->contrasena)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas.',
                'data' => null
            ], 401);
        }

        // Validación de Licencia
        if ($user->nit) {
            $empresa = Empresa::with('licenciaActual.tipoLicencia')->find($user->nit);

            if ($empresa) {
                $licencia = $empresa->licenciaActual;

                if (!$licencia) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Su empresa no tiene una licencia asignada. Contacte al administrador.',
                        'data' => null
                    ], 403);
                }

                $estadoLicencia = $licencia->tipoLicencia->id_estado ?? null;

                if ($estadoLicencia != 1) {
                    $estadoTexto = match ($estadoLicencia) {
                        2 => 'Inactiva',
                        3 => 'Sin Licencia',
                        4 => 'Por vencer',
                        5 => 'Vencida',
                        6 => 'Bloqueada (Pendiente de Pago)',
                        default => 'Desconocido',
                    };

                    return response()->json([
                        'success' => false,
                        'message' => "Acceso denegado. La licencia de su empresa está: $estadoTexto.",
                        'data' => null
                    ], 403);
                }
            }
        }

        // --- NUEVA LÓGICA 2FA PARA ADMINISTRADORES (ID_ROL 2) ---
        if ($user->id_rol == 2) {
            $code = random_int(100000, 999999);
            
            // Guardar en caché por 5 minutos
            Cache::put('2fa_login_' . $user->email, $code, now()->addMinutes(5));

            try {
                \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\Send2FACode($code));

                return response()->json([
                    'success' => true,
                    'message' => 'Se ha enviado un código de verificación a su correo electrónico.',
                    'data' => [
                        'requires_2fa' => true,
                        'email' => $user->email
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al enviar el código de verificación: ' . $e->getMessage(),
                    'data' => null
                ], 500);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]
        ]);
    }

    /**
     * Verificar código 2FA para el login de administrador
     */
    public function verify2FA(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric'
        ]);

        $cacheKey = '2fa_login_' . $request->email;
        $storedCode = Cache::get($cacheKey);

        if (!$storedCode || (int)$storedCode !== (int)$request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Código de verificación incorrecto o expirado.',
                'data' => null
            ], 401);
        }

        $user = Usuario::with(['especialidad', 'consultorio', 'rol', 'empresa'])->where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado.',
                'data' => null
            ], 404);
        }

        // Limpiar caché
        Cache::forget($cacheKey);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Verificación exitosa',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]
        ]);
    }

    /**
     * Retorna el usuario autenticado con sus relaciones
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['rol', 'empresa', 'especialidad', 'farmacia', 'consultorio']);

        return response()->json([
            'success' => true,
            'message' => 'Usuario autenticado',
            'data' => $user
        ]);
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente',
            'data' => null
        ]);
    }

    /**
     * Paso 1: Enviar código de recuperación
     */
    public function sendRecoveryCode(SendRecoveryCodeRequest $request)
    {
        $ipKey = 'recovery_ip_' . $request->ip();
        $emailKey = 'user_recovery_email_' . $request->email;
        $delayKey = 'user_recovery_delay_' . $request->email;

        if (RateLimiter::tooManyAttempts($ipKey, 10)) {
            $seconds = RateLimiter::availableIn($ipKey);
            return response()->json([
                'success' => false,
                'message' => 'Demasiados intentos desde esta IP. Por favor intente en ' . ceil($seconds / 60) . ' minutos.',
                'data' => [
                    'remaining_time' => $seconds,
                    'available_attempts' => 0
                ]
            ], 429);
        }

        if (RateLimiter::tooManyAttempts($emailKey, 5)) {
            $seconds = RateLimiter::availableIn($emailKey);
            return response()->json([
                'success' => false,
                'message' => 'Ha excedido el límite de códigos para este correo. Por favor intente en ' . ceil($seconds / 60) . ' minutos.',
                'data' => [
                    'remaining_time' => $seconds,
                    'available_attempts' => 0
                ]
            ], 429);
        }

        if (RateLimiter::tooManyAttempts($delayKey, 1)) {
            $seconds = RateLimiter::availableIn($delayKey);
            return response()->json([
                'success' => false,
                'message' => 'Debe esperar ' . $seconds . ' segundos antes de solicitar otro código.',
                'data' => [
                    'remaining_time' => $seconds,
                    'available_attempts' => RateLimiter::remaining($emailKey, 5)
                ]
            ], 429);
        }

        RateLimiter::hit($ipKey, 1800);
        RateLimiter::hit($delayKey, 30);

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Correo no encontrado',
                'data' => null
            ], 404);
        }

        RateLimiter::hit($emailKey, 1800);

        $code = random_int(100000, 999999);

        Cache::put('user_recovery_' . $request->email, $code, now()->addMinutes(10));

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\SendRecoveryCodeMail($code));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error enviando correo',
                'data' => null
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Código enviado',
            'data' => [
                'available_attempts' => RateLimiter::remaining($emailKey, 5)
            ]
        ]);
    }

    /**
     * Paso 2: Verificar código de recuperación
     */
    public function verifyRecoveryCode(VerifyRecoveryCodeRequest $request)
    {
        $cachedCode = Cache::get('user_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Código inválido o expirado',
                'data' => null
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Código correcto',
            'data' => null
        ]);
    }

    /**
     * Paso 3: Restablecer contraseña
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $cachedCode = Cache::get('user_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Sesión expirada o código inválido',
                'data' => null
            ], 400);
        }

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
                'data' => null
            ], 404);
        }

        $user->contrasena = $request->password;
        $user->save();

        Cache::forget('user_recovery_' . $request->email);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente',
            'data' => null
        ]);
    }
}