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
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $superadmin = Superadmin::where('email', $request->email)->first();

        if (!$superadmin || !Hash::check($request->password, $superadmin->contrasena)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        // Generar código 2FA (6 dígitos)
        $code = random_int(100000, 999999);

        // Guardar en cache por 5 minutos (NO BD)
        Cache::put(
            'superadmin_2fa_' . $superadmin->email,
            $code,
            now()->addMinutes(5)
        );

       // 🔴 COMENTA ESTE BLOQUE TEMPORALMENTE

Mail::raw(
    "Tu código de verificación es: {$code}",
    function ($message) use ($superadmin) {
        $message->to($superadmin->email)
                ->subject('Código de verificación - EPS');
    }
);



        return response()->json([
            'message' => 'Código enviado al correo'
        ]);
    }

    /**
     * Paso 2: Verificar código 2FA
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

        // Código válido → eliminar del cache
        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Autenticación exitosa'
        ]);
    }
}
