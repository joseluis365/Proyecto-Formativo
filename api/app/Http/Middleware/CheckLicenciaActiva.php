<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckLicenciaActiva
{
    /**
     * Valida que la empresa del usuario autenticado tenga una licencia vigente.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // 1. Validar usuario autenticado
        if (!$user) {
            return response()->json([
                'message' => 'Acceso denegado. Usuario no autenticado.'
            ], 401);
        }

        // 2. Permitir bypass explícitamente solo si es Superadmin
        if ($user instanceof \App\Models\Superadmin) {
            return $next($request);
        }

        // 3. Verificar licencia de la empresa asociada (para Usuarios normales)
        // Buscamos la licencia que sea Activa (id_estado = 1) y no esté vencida
        $licenciaActiva = \App\Models\EmpresaLicencia::where('nit', $user->nit)
            ->where('id_estado', 1)
            ->where('fecha_fin', '>=', Carbon::today())
            ->exists();

        // 4. Si no existe licencia válida, denegar acceso
        if (!$licenciaActiva) {
            return response()->json([
                'status' => 'error',
                'message' => 'La licencia de su empresa no está activa o ha expirado. Por favor, contacte con el administrador.',
                'code' => 'LICENSE_INACTIVE'
            ], 403);
        }

        return $next($request);
    }
}
