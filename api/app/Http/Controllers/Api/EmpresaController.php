<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Resources\EmpresaResource;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    \Illuminate\Support\Facades\Artisan::call('app:check-licenses');
    // Eager loading de la última licencia para evitar el problema N+1
    $query = Empresa::with(['licenciaActual']);

    // Búsqueda
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
              ->orWhere('nit', 'like', "%{$search}%");
        });
    }

    // Filtro por estado
    // Nota: Como el estado es calculado en el Resource, el filtro 
    // debe usar whereHas para buscar en la tabla de licencias.
    if ($request->filled('id_estado')) {
        $estado = $request->id_estado;
        if ($estado == 3) {
            $query->whereDoesntHave('licencias');
        } else {
            $query->whereHas('licenciaActual', function ($q) use ($estado) {
                // Aquí podrías aplicar la misma lógica de fechas si quieres 
                // que el filtro sea 100% exacto, pero por ahora filtramos por el id_estado de la DB
                $q->where('id_estado', $estado);
            });
        }
    }

    $empresas = $query->get();

    return response()->json([
        'data' => EmpresaResource::collection($empresas)
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        return response()->json(
            Empresa::with(['licenciaActual.tipoLicencia', 'adminUser'])->findOrFail($id)
        );
    }

    // 📌 CREAR
    public function store(StoreEmpresaRequest $request)
    {
        $data = $request->validated();
        
        // Default estado SIN LICENCIA (3)
        if (!isset($data['id_estado'])) {
            $data['id_estado'] = 3;
        }

        try {
            return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
                // 1. Crear Empresa
                $empresaData = collect($data)->except(['admin_nombre', 'admin_documento', 'admin_email', 'admin_password'])->toArray();
                $empresa = Empresa::create($empresaData);

                // 2. Crear Usuario Admin asociado
                $usuario = \App\Models\Usuario::create([
                    'documento' => $data['admin_documento'], // Clave primaria correcta
                    'nombre' => $data['admin_nombre'],
                    'email' => $data['admin_email'],
                    'contrasena' => \Illuminate\Support\Facades\Hash::make($data['admin_password']),
                    'id_rol' => 2, // 2 = Admin Empresa
                    'id_estado' => 1, // Activo
                    'nit' => $empresa->nit,
                    'telefono' => $empresa->telefono_representante, 
                    'direccion' => $empresa->direccion,
                    'is_active' => true 
                ]);

                return response()->json([
                    'message' => 'Empresa y administrador creados correctamente',
                    'data' => $empresa
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 📌 ACTUALIZAR
    public function update(Request $request, $id)
    {
        $user = Empresa::findOrFail($id);

        $data = $request->validate([
            'nit' => 'required|integer|unique:users,id,' . $id,
            'nombre'   => 'required|string|max:255',
            'email_contacto'  => 'required|email|unique:users,email,' . $id,
            'telefono' => 'required|integer',
            'direccion' => 'required|string',
            'documento_representante' => 'required|integer',
            'nombre_representante' => 'required|string',
            'telefono_representante' => 'required|integer',
            'email_representante' => 'required|email',
            'id_estado' => 'required|integer',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'user' => $user
        ]);
    }

    // 📌 ELIMINAR
    public function destroy($id)
    {
        Empresa::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Empresa eliminada'
        ]);
    }
}