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
     * Paso 2: Verificar código 2FA
     */
    public function verificarCodigo(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'codigo' => 'required|digits:6'
        ]);

        $admin = Superadmin::where('email', $request->email)->first();

        if (!$admin) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $cacheKey = 'superadmin_2fa_' . $request->email;
        $cachedCode = Cache::get($cacheKey);

        if (!$cachedCode) {
            return response()->json([
                'message' => 'El código ha expirado'
            ], 401);
        }

        // ✅ COMPARACIÓN CORRECTA (TIPOS NORMALIZADOS)
        if ((string) $cachedCode !== (string) $request->codigo) {
            return response()->json([
                'message' => 'Código incorrecto'
            ], 401);
        }

        // 🔥 Invalidar código
        Cache::forget($cacheKey);

        // 🔐 Marcar sesión temporal del superadmin
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
