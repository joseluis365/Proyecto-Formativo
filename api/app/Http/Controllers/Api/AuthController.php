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

        // ==========================
        // VALIDACIÓN DE LICENCIA
        // ==========================
        if ($user->nit) {

            // Cargamos también el tipo de licencia
            $empresa = Empresa::with('licenciaActual.tipoLicencia')->find($user->nit);

            if ($empresa) {

                $licencia = $empresa->licenciaActual;

                if (!$licencia) {
                    return response()->json([
                        'message' => 'Su empresa no tiene una licencia asignada. Contacte al administrador.',
                    ], 403);
                }

                // Tomamos el estado desde tipo_licencia
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
        $request->validate(['email' => 'required|email'], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
        ]);

        $ipKey = 'recovery_ip_' . $request->ip();
        $emailKey = 'user_recovery_email_' . $request->email;
        $delayKey = 'user_recovery_delay_' . $request->email;

        if (RateLimiter::tooManyAttempts($ipKey, 10)) {
            $seconds = RateLimiter::availableIn($ipKey);
            return response()->json([
                'message' => 'Demasiados intentos desde esta IP. Por favor intente en ' . ceil($seconds / 60) . ' minutos.',
                'remaining_time' => $seconds,
                'available_attempts' => 0
            ], 429);
        }

        if (RateLimiter::tooManyAttempts($emailKey, 5)) {
            $seconds = RateLimiter::availableIn($emailKey);
            return response()->json([
                'message' => 'Ha excedido el límite de códigos para este correo. Por favor intente en ' . ceil($seconds / 60) . ' minutos.',
                'remaining_time' => $seconds,
                'available_attempts' => 0
            ], 429);
        }

        if (RateLimiter::tooManyAttempts($delayKey, 1)) {
            $seconds = RateLimiter::availableIn($delayKey);
            return response()->json([
                'message' => 'Debe esperar ' . $seconds . ' segundos antes de solicitar otro código.',
                'remaining_time' => $seconds,
                'available_attempts' => RateLimiter::remaining($emailKey, 5)
            ], 429);
        }

        RateLimiter::hit($ipKey, 1800);
        RateLimiter::hit($delayKey, 30);

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Correo no encontrado'], 404);
        }

        RateLimiter::hit($emailKey, 1800);

        $code = random_int(100000, 999999);

        Cache::put('user_recovery_' . $request->email, $code, now()->addMinutes(10));

        try {
            Mail::send('emails.recovery_code', ['code' => $code], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Recuperación de Contraseña - Proyecto EPS');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error enviando correo'], 500);
        }

        return response()->json([
            'message' => 'Código enviado',
            'available_attempts' => RateLimiter::remaining($emailKey, 5)
        ]);
    }

    /**
     * Paso 2: Verificar código de recuperación
     */
    public function verifyRecoveryCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric|digits:6|regex:/^[0-9]{6}$/'
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'code.required' => 'El código es obligatorio.',
            'code.numeric' => 'El código debe ser numérico.',
            'code.digits' => 'El código debe tener 6 dígitos.',
            'code.regex' => 'El código debe tener 6 numeros sin espacios.',
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
            'password' => 'required|string|min:8|max:25|regex:/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/'
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'code.required' => 'El código es obligatorio.',
            'code.numeric' => 'El código debe ser numérico.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.max' => 'La contraseña debe tener como maximo 25 caracteres.',
            'password.regex' => 'La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial',
        ]);

        $cachedCode = Cache::get('user_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json(['message' => 'Sesión expirada o código inválido'], 400);
        }

        $user = Usuario::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Se asigna la contraseña directamente, el mutator en el modelo Usuario se encargará de hashearla.
        $user->contrasena = $request->password;
        $user->save();

        Cache::forget('user_recovery_' . $request->email);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}