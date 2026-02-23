<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Superadmin;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SuperadminAuthController extends Controller
{
    /**
     * Paso 1: Validar credenciales y enviar código 2FA por correo
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/|email:rfc,dns|max:150|min:12',
            'password' => 'required|string|max:25|min:8',
        ],
        [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'El correo debe ser válido',
            'email.regex' => 'El formato del correo no es válido',
            'email.max' => 'El correo debe tener máximo 150 caracteres',
            'email.min' => 'El correo debe tener mínimo 12 caracteres',
            'password.required' => 'La contraseña es obligatoria',
            'password.max' => 'La contraseña debe tener máximo 25 caracteres',
            'password.min' => 'La contraseña debe tener mínimo 8 caracteres',
        ]);

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin || !Hash::check($request->password, $superadmin->contrasena)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $code = random_int(100000, 999999);

        Cache::put(
            'superadmin_2fa_' . $superadmin->email,
            $code,
            now()->addMinutes(5)
        );

        try {
            Mail::raw(
                "Tu código de verificación es: {$code}",
                function ($message) use ($superadmin) {
                    $message->to($superadmin->email)
                            ->subject('Código de verificación - EPS');
                }
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Código enviado al correo'
        ]);
    }

    /**
     * Paso 2: Verificar código 2FA y generar Token
     */
    public function verificarCodigo(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric',
        ]);

        $cacheKey = 'superadmin_2fa_' . $request->email;
        $storedCode = Cache::get($cacheKey);

        if (!$storedCode || (int) $storedCode !== (int) $request->code) {
            return response()->json([
                'message' => 'Código inválido o expirado'
            ], 401);
        }

        // Código válido -> Obtener usuario
        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
             return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Generar Token de Sanctum
        $token = $superadmin->createToken('superadmin_auth_token')->plainTextToken;

        // Eliminar código del cache
        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Autenticación exitosa',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $superadmin
        ]);
    }
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    public function checkSession(Request $request)
    {
        return response()->json([
            'message' => 'Sesión activa',
            'user' => $request->user()
        ]);
    }

    /**
     * Paso 1: Enviar código de recuperación
     */
    public function sendRecoveryCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email:rfc,dns|max:150|min:12|regex:/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/'
        ],
        [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'El correo debe ser válido',
            'email.regex' => 'El formato del correo no es válido',
            'email.max' => 'El correo debe tener máximo 150 caracteres',
            'email.min' => 'El correo debe tener mínimo 12 caracteres',
        ]);

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
            return response()->json(['message' => 'Correo no encontrado'], 404);
        }

        $code = random_int(100000, 999999);

        // Guardar código de recuperación por 10 minutos
        Cache::put('superadmin_recovery_' . $request->email, $code, now()->addMinutes(10));

        try {
            Mail::raw(
                "Tu código de recuperación es: {$code}. Válido por 10 minutos.",
                function ($message) use ($superadmin) {
                    $message->to($superadmin->email)
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
            'code' => 'required|numeric|digits:6|regex:/^[0-9]+$/'
        ],
        [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'El correo debe ser válido',
            'email.regex' => 'El formato del correo no es válido',
            'email.max' => 'El correo debe tener máximo 150 caracteres',
            'email.min' => 'El correo debe tener mínimo 12 caracteres',
            'code.required' => 'El código es obligatorio',
            'code.numeric' => 'El código debe ser numérico',
            'code.digits' => 'El código debe tener 6 dígitos',
            'code.regex' => 'El código debe tener 6 numeros sin espacios.',
        ]);

        $cachedCode = Cache::get('superadmin_recovery_' . $request->email);

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
            'code' => 'required|numeric|digits:6|regex:/^[0-9]{6}$/',
            'password' => 'required|string|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/|min:8|max:25|confirmed'
        ],
        [
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'El correo debe ser válido',
            'email.regex' => 'El formato del correo no es válido',
            'email.max' => 'El correo debe tener máximo 150 caracteres',
            'email.min' => 'El correo debe tener mínimo 12 caracteres',
            'code.required' => 'El código es obligatorio',
            'code.numeric' => 'El código debe ser numérico',
            'code.digits' => 'El código debe tener 6 dígitos',
            'code.regex' => 'El código debe tener 6 numeros sin espacios.',
            'password.required' => 'La contraseña es obligatoria',
            'password.string' => 'La contraseña debe ser una cadena de texto',
            'password.min' => 'La contraseña debe tener mínimo 8 caracteres',
            'password.regex' => 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password.max' => 'La contraseña debe tener máximo 25 caracteres',
        ]);

        // Verificar código nuevamente por seguridad
        $cachedCode = Cache::get('superadmin_recovery_' . $request->email);

        if (!$cachedCode || (int)$cachedCode !== (int)$request->code) {
            return response()->json(['message' => 'Sesión expirada o código inválido'], 400);
        }

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $superadmin->contrasena = Hash::make($request->password);
        $superadmin->save();

        // Eliminar código usado
        Cache::forget('superadmin_recovery_' . $request->email);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
