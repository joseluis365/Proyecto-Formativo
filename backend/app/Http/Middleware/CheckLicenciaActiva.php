<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckLicenciaActiva
{
    public function handle($request, Closure $next)
    {
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    if (!$user->empresa) {
        return response()->json(['message' => 'Usuario sin empresa asociada'], 403);
    }

    if (!$user->empresa->licenciaVigente()) {
        return response()->json(['message' => 'Licencia inactiva o vencida'], 403);
    }

    return $next($request);
}

}
