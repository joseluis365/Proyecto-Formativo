<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\EmpresaLicencia;
use App\Models\Estado;

class CheckEmpresaLicencia
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        if (!$usuario->nit) {
            return response()->json([
                'message' => 'Usuario sin empresa asociada',
                'code' => 'EMPRESA_NO_ASOCIADA'
            ], 403);
        }

        $estadoActiva = Estado::where('nombre_estado', 'ACTIVA')->first();

        if (!$estadoActiva) {
            return response()->json([
                'message' => 'Estado ACTIVA no configurado',
                'code' => 'CONFIG_ERROR'
            ], 500);
        }

        $licencia = EmpresaLicencia::where('nit', $usuario->nit)
            ->where('id_estado', $estadoActiva->id_estado)
            ->whereDate('fecha_inicio', '<=', now())
            ->whereDate('fecha_fin', '>=', now())
            ->orderByDesc('fecha_fin')
            ->first();

        if (!$licencia) {
            return response()->json([
                'message' => 'La empresa no tiene una licencia activa',
                'code' => 'LICENCIA_INVALIDA'
            ], 403);
        }

        return $next($request);
    }
}
