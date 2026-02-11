<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Empresa;
use App\Models\Usuario;
use App\Models\EmpresaLicencia;

class RegistroEmpresaController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validamos todo lo que viene del formulario
        $request->validate([
            'nit' => 'required|unique:empresa,nit',
            'nombre' => 'required|string',
            'direccion' => 'required|string',
            'email_contacto' => 'required|email|unique:usuario,email',
            'telefono' => 'required|string',
            'documento_representante' => 'required|string',
            'nombre_representante' => 'required|string',
            'email_representante' => 'required|email|unique:usuario,email',
            'telefono_representante' => 'required|string',
            'ciudad' => 'required|string',
            'admin_name' => 'required|string',
            'admin_email' => 'required|email|unique:usuario,email',
            'admin_password' => 'required|min:8',
            'id_tipo_licencia' => 'required|exists:tipo_licencia,id_tipo_licencia',
            'duracion_meses' => 'required|integer'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                
                // PASO 1: Crear la Empresa
                $empresa = Empresa::create([
                    'nit' => $request->nit,
                    'nombre' => $request->nombre,
                    'email_contacto' => $request->email_contacto,
                    'telefono' => $request->telefono,
                    'documento_representante' => $request->documento_representante,
                    'nombre_representante' => $request->nombre_representante,
                    'email_representante' => $request->email_representante,
                    'telefono_representante' => $request->telefono_representante,
                    'ciudad' => $request->ciudad,
                    'direccion' => $request->direccion,
                    'id_estado' => 1, // Estado inicial (ej: registrado sin activar)
                ]);

                // PASO 2: Crear el Usuario Administrador vinculado a ese NIT
                $user = Usuario::create([
                    'documento' => $request->admin_documento,
                    'nombre' => $request->admin_name,
                    'email' => $request->admin_email,
                    'contrasena' => Hash::make($request->admin_password),
                    'nit' => $empresa->nit, // Relación por NIT
                    'id_rol' => 2, // Rol de Admin de Empresa
                    'id_estado' => 1,
                ]);

                $numeros = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
                $letras = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 6));
                $customId = $numeros . $letras;

                // PASO 3: Vincular la Licencia (con estado Pendiente)
                EmpresaLicencia::create([
                    'id_empresa_licencia' => $customId,
                    'nit' => $empresa->nit,
                    'id_tipo_licencia' => $request->id_tipo_licencia,
                    'fecha_inicio' => now(),
                    'fecha_fin' => now()->addMonths($request->duracion_meses),
                    'id_estado' => 6, // ESTADO 6: Pendiente de pago/activación
                    'referencia_pago' => 'REF-' . strtoupper(bin2hex(random_bytes(4)))
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Empresa y licencia registradas. Esperando aprobación.'
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al registrar: ' . $e->getMessage()
            ], 500);
        }
    }
}