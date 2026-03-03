<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Superadmin;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Requests\Auth\SuperadminLoginRequest;
use App\Http\Requests\Auth\SuperadminVerifyCodeRequest;
use App\Http\Requests\Auth\SuperadminSendRecoveryCodeRequest;
use App\Http\Requests\Auth\SuperadminVerifyRecoveryCodeRequest;
use App\Http\Requests\Auth\SuperadminResetPasswordRequest;

class SuperadminAuthController extends Controller
{
    /**
     * Paso 1: Validar credenciales y enviar código 2FA por correo
     */
    public function login(SuperadminLoginRequest $request)
    {
        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin || !Hash::check($request->password, $superadmin->contrasena)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas',
                'data' => null
            ], 401);
        }

        $code = random_int(100000, 999999);

        Cache::put(
            'superadmin_2fa_' . $superadmin->email,
            $code,
            now()->addMinutes(5)
        );

        try {
            Mail::send('emails.verification_code', ['code' => $code], function ($message) use ($superadmin) {
                $message->to($superadmin->email)
                        ->subject('Código de verificación - Proyecto EPS');
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Código enviado al correo',
            'data' => null
        ]);
    }

    /**
     * Paso 2: Verificar código 2FA y generar Token
     */
    public function verificarCodigo(SuperadminVerifyCodeRequest $request)
    {
        $cacheKey = 'superadmin_2fa_' . $request->email;
        $storedCode = Cache::get($cacheKey);

        if (!$storedCode || (int) $storedCode !== (int) $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Código inválido o expirado, por favor inténtalo de nuevo',
                'data' => null
            ], 401);
        }

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
             return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
                'data' => null
            ], 404);
        }

        $token = $superadmin->createToken('superadmin_auth_token')->plainTextToken;

        Cache::forget($cacheKey);

        return response()->json([
            'success' => true,
            'message' => 'Autenticación exitosa',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $superadmin
            ]
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
     * Verificar sesión activa
     */
    public function checkSession(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Sesión activa',
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }

    /**
     * Paso 1: Enviar código de recuperación
     */
    public function sendRecoveryCode(SuperadminSendRecoveryCodeRequest $request)
    {
        $ipKey = 'superadmin_recovery_ip_' . $request->ip();
        $emailKey = 'superadmin_recovery_email_' . $request->email;
        $delayKey = 'superadmin_recovery_delay_' . $request->email;

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
                'message' => 'Ha excedido el límite de códigos (5) para este correo. Por favor intente en ' . ceil($seconds / 60) . ' minutos.',
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

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
            return response()->json([
                'success' => false,
                'message' => 'Correo no encontrado',
                'data' => null
            ], 404);
        }

        RateLimiter::hit($emailKey, 1800);

        $code = random_int(100000, 999999);

        Cache::put('superadmin_recovery_' . $request->email, $code, now()->addMinutes(10));

        try {
            Mail::send('emails.recovery_code', ['code' => $code], function ($message) use ($superadmin) {
                $message->to($superadmin->email)
                        ->subject('Recuperación de Contraseña - Proyecto EPS');
            });
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
    public function verifyRecoveryCode(SuperadminVerifyRecoveryCodeRequest $request)
    {
        $cachedCode = Cache::get('superadmin_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Código inválido o expirado, por favor inténtalo de nuevo',
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
    public function resetPassword(SuperadminResetPasswordRequest $request)
    {
        $cachedCode = Cache::get('superadmin_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Sesión expirada o código inválido',
                'data' => null
            ], 400);
        }

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado',
                'data' => null
            ], 404);
        }

        $superadmin->contrasena = Hash::make($request->password);
        $superadmin->save();

        Cache::forget('superadmin_recovery_' . $request->email);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente',
            'data' => null
        ]);
    }
}
