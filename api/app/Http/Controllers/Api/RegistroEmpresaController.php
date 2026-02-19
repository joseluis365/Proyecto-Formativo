<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Empresa;
use App\Models\Usuario;
use App\Models\EmpresaLicencia;
use App\Http\Requests\StoreEmpresaRequest;
use App\Events\SystemActivityEvent;

class RegistroEmpresaController extends Controller
{
    public function store(StoreEmpresaRequest $request)
    {
        // Validamos todo lo que viene del formulario
        $request->validate([
            'nit' => 'required|unique:empresa,nit',
            'nombre' => 'required|string',
            'direccion' => 'required|string',
            'email_contacto' => 'required|email:rfc,dns|unique:usuario,email',
            'telefono' => 'required|numeric|min:10|max:10|regex:/^\d{1,10}$/',
            'documento_representante' => 'required|string',
            'nombre_representante' => 'required|string',
            'email_representante' => 'required|email:rfc,dns|unique:usuario,email',
            'telefono_representante' => 'required|numeric|min:10|max:10|regex:/^\d{1,10}$/',
            'id_ciudad' => 'required|exists:ciudad,codigo_postal',
            'admin_nombre' => 'required|string',
            'admin_apellido' => 'required|string',
            'admin_documento' => 'required|string|unique:usuario,documento',
            'admin_email' => 'required|email:rfc,dns|unique:usuario,email',
            'admin_telefono' => 'required|numeric|min:10|max:10|regex:/^\d{1,10}$/',
            'admin_direccion' => 'required|string',
            'admin_password' => 'required|min:8',
            'id_tipo_licencia' => 'required|exists :tipo_licencia,id_tipo_licencia',
            'duracion_meses' => 'required|integer'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                
                // Crear la Empresa
                $empresa = Empresa::create([
                    'nit' => $request->nit,
                    'nombre' => $request->nombre,
                    'email_contacto' => $request->email_contacto,
                    'telefono' => $request->telefono,
                    'documento_representante' => $request->documento_representante,
                    'nombre_representante' => $request->nombre_representante,
                    'email_representante' => $request->email_representante,
                    'telefono_representante' => $request->telefono_representante,
                    'id_ciudad' => $request->id_ciudad,
                    'direccion' => $request->direccion,
                    'id_estado' => 1,
                ]);

                event(new SystemActivityEvent(
                    "Nueva empresa registrada: " . $empresa->nombre, // Título
                    'red',                                   // Tipo (Color rojo)
                    'store',                                       // Icono
                    'superadmin-feed'
                ));

                // Crear el Usuario Administrador vinculado a ese NIT
                $user = Usuario::create([
                    'documento' => $request->admin_documento,
                    'nombre' => $request->admin_nombre,
                    'apellido' => $request->admin_apellido,
                    'email' => $request->admin_email,
                    'telefono' => $request->admin_telefono,
                    'direccion' => $request->admin_direccion,
                    'contrasena' => Hash::make($request->admin_password),
                    'nit' => $empresa->nit, 
                    'id_rol' => 2, 
                    'id_estado' => 1,
                ]);

                $numeros = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
                $letras = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 6));
                $customId = $numeros . $letras;

                // Vincular la Licencia (con estado Pendiente)
                EmpresaLicencia::create([
                    'id_empresa_licencia' => $customId,
                    'nit' => $empresa->nit,
                    'id_tipo_licencia' => $request->id_tipo_licencia,
                    'fecha_inicio' => null,
                    'fecha_fin' => null,
                    'id_estado' => 6, 
                ]);

                event(new SystemActivityEvent(
                    "Nueva licencia registrada: " . $customId, // Título
                    'blue',                                   // Tipo (Color rojo)
                    'store',                                       // Icono
                    'superadmin-feed'
                ));

                

                

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