<?php

namespace App\Http\Controllers;

use App\Models\Superadmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SuperadminAuthController extends Controller
{
    /**
     * Paso 1: Validar credenciales y enviar código 2FA
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = Superadmin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Generar código de 6 dígitos
        $code = random_int(100000, 999999);

        // Guardar código en cache por 5 minutos
        Cache::put(
            'superadmin_2fa_' . $admin->email,
            $code,
            now()->addMinutes(5)
        );

        // Enviar código por correo
        Mail::raw(
            "Tu código de verificación es: {$code}",
            function ($msg) use ($admin) {
                $msg->to($admin->email)
                    ->subject('Código de acceso - Superadmin');
            }
        );

        return response()->json([
            'message' => 'Código de verificación enviado al correo'
        ]);
    }

    /**
     * Paso 2: Verificar código 2FA
     */
    public function verificarCodigo(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'codigo' => 'required|digits:6'
        ]);

        $cachedCode = Cache::get('superadmin_2fa_' . $request->email);

        if (!$cachedCode || $cachedCode != $request->codigo) {
            return response()->json([
                'message' => 'Código inválido o expirado'
            ], 401);
        }

        // Eliminar código del cache
        Cache::forget('superadmin_2fa_' . $request->email);

        // Marcar como autenticado por 30 minutos
        Cache::put(
            'superadmin_auth_' . $request->email,
            true,
            now()->addMinutes(30)
        );

        return response()->json([
            'message' => 'Autenticación de superadmin exitosa'
        ]);
    }
}
