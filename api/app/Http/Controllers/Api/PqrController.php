<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pqr;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Mail\PqrRespuestaMail;

/**
 * Controlador de PQR.
 * Administra peticiones, quejas y reclamos de usuarios.
 */
class PqrController extends Controller
{
    // Obtener todas las PQR ordenadas por las más recientes
    public function index()
    {
        $pqrs = Pqr::with('estado')->orderBy('id_pqr', 'desc')->get();
        return response()->json(['data' => $pqrs]);
    }

    // Almacenar una nueva PQR desde el formulario público
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:50',
            'message' => 'required|string|max:500',
        ]);

        try {
            $pqr = Pqr::create([
                'nombre_usuario' => $validated['name'],
                'email' => $validated['email'],
                'telefono' => $validated['phone'],
                'asunto' => $validated['subject'],
                'mensaje' => $validated['message'],
                'id_estado' => 13, // 13 = Pendiente
            ]);

            return response()->json([
                'success' => true,
                'message' => 'PQRS registrada correctamente. Nos pondremos en contacto pronto.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error guardando PQRS: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar la PQR. Intente de nuevo más tarde.'
            ], 500);
        }
    }

    // Responder a una PQR
    public function responder(Request $request, $id)
    {
        $request->validate([
            'respuesta' => 'required|string|min:10|max:1000',
            'archivo_adjunto' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:5120' // 5MB limit
        ]);

        try {
            $pqr = Pqr::findOrFail($id);
            
            // Manejar el archivo adjunto si existe
            if ($request->hasFile('archivo_adjunto')) {
                $file = $request->file('archivo_adjunto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('pqrs_adjuntos', $filename, 'public');
                $pqr->archivo_adjunto = $path;
            }

            // Actualizar el registro
            $pqr->respuesta = $request->respuesta;
            $pqr->id_estado = 10; // 10 = Atendido
            $pqr->save();

            event(new \App\Events\SystemActivityEvent(
                "PQR respondida: {$pqr->asunto}",
                'orange',
                'support_agent',
                'admin-feed'
            ));

            // Enviar correo de respuesta al usuario
            Mail::to($pqr->email)->send(new PqrRespuestaMail($pqr));

            return response()->json([
                'success' => true,
                'message' => 'Respuesta enviada y PQR actualizada correctamente.',
                'data' => $pqr->load('estado')
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error respondiendo PQRS: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la respuesta: ' . $e->getMessage()
            ], 500);
        }
    }
}
