<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLicencia
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // 1️⃣ Usuario activo
        if ($user->estado->nombre_estado !== 'Activo') {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], 403);
        }

        // 2️⃣ Superadmin no requiere licencia
        if ($user->rol->tipo_usu === 'Superadmin') {
            return $next($request);
        }

        // 3️⃣ Usuario debe pertenecer a una empresa
        if (!$user->empresa) {
            return response()->json([
                'message' => 'Usuario sin empresa asociada'
            ], 403);
        }

        // 4️⃣ Empresa activa
        if ($user->empresa->estado->nombre_estado !== 'Activo') {
            return response()->json([
                'message' => 'Empresa inactiva'
            ], 403);
        }

        // 5️⃣ Licencia vigente
        $licencia = $user->empresa->licenciaVigente();

        if (!$licencia) {
            return response()->json([
                'message' => 'Licencia vencida o inexistente'
            ], 403);
        }

        return $next($request);
    }
}
