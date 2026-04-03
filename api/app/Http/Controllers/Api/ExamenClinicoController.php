<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ExamenClinicoController extends Controller
{
    /**
     * Lista los exámenes agendados (citas de tipo 'examen').
     */
    public function agenda(Request $request)
    {
        // ---------------------------------------------------------
        // Lógica de auto-cancelación de exámenes no atendidos
        // ---------------------------------------------------------
        $estadoAgendada = \App\Models\Estado::where('nombre_estado', 'Agendada')->first();
        $estadoCancelada = \App\Models\Estado::where('nombre_estado', 'Cancelada')->first();

        if ($estadoAgendada && $estadoCancelada) {
            $now = \Carbon\Carbon::now();
            $cutoff = $now->copy()->subMinutes(30);
            \App\Models\Examen::where('id_estado', $estadoAgendada->id_estado)
                ->where(function ($query) use ($now, $cutoff) {
                    $query->where('fecha', '<', $now->toDateString())
                          ->orWhere(function ($q) use ($now, $cutoff) {
                              $q->where('fecha', $now->toDateString())
                                ->whereTime('hora_inicio', '<=', $cutoff->toTimeString());
                          });
                })->update(['id_estado' => $estadoCancelada->id_estado]);
        }
        // ---------------------------------------------------------

        $fecha = $request->query('fecha');

        $query = \App\Models\Examen::with(['paciente', 'categoriaExamen', 'estado']);

        if ($fecha) {
            $query->where('fecha', $fecha);
        }

        $examenes = $query->orderBy('fecha', 'asc')
                       ->orderBy('hora_inicio', 'asc')
                       ->get();

        return response()->json([
            'success' => true,
            'data' => $examenes
        ]);
    }

    /**
     * Lista los exámenes de un paciente específico.
     */
    public function misExamenes(Request $request)
    {
        // ---------------------------------------------------------
        // Lógica de auto-cancelación de exámenes no atendidos
        // ---------------------------------------------------------
        $estadoAgendada = \App\Models\Estado::where('nombre_estado', 'Agendada')->first();
        $estadoCancelada = \App\Models\Estado::where('nombre_estado', 'Cancelada')->first();

        if ($estadoAgendada && $estadoCancelada) {
            $now = \Carbon\Carbon::now();
            $cutoff = $now->copy()->subMinutes(30);
            \App\Models\Examen::where('id_estado', $estadoAgendada->id_estado)
                ->where(function ($query) use ($now, $cutoff) {
                    $query->where('fecha', '<', $now->toDateString())
                          ->orWhere(function ($q) use ($now, $cutoff) {
                              $q->where('fecha', $now->toDateString())
                                ->whereTime('hora_inicio', '<=', $cutoff->toTimeString());
                          });
                })->update(['id_estado' => $estadoCancelada->id_estado]);
        }
        // ---------------------------------------------------------

        $doc = $request->query('doc_paciente');
        
        if (!$doc) {
            return response()->json(['success' => false, 'message' => 'Documento requerido'], 400);
        }

        $examenes = \App\Models\Examen::with(['paciente', 'categoriaExamen', 'estado'])
            ->where('doc_paciente', $doc)
            ->orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $examenes
        ]);
    }

    /**
     * Obtiene los detalles de un solo examen.
     */
    public function show(int $id)
    {
        $examen = \App\Models\Examen::with(['paciente', 'categoriaExamen', 'estado'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $examen
        ]);
    }

    /**
     * Atiende el examen (sube PDF, marca como Atendida, envía correo).
     */
    public function atender(Request $request, int $id)
    {
        $request->validate([
            'resultado_pdf' => 'required|file|mimes:pdf|max:10240', // Max 10MB
        ]);

        $examen = \App\Models\Examen::with(['paciente', 'categoriaExamen'])->findOrFail($id);

        if ($examen->estado && in_array($examen->estado->nombre_estado, ['Atendida', 'Finalizada'])) {
            return response()->json(['message' => 'Este examen ya fue atendido'], 422);
        }

        // Subir archivo
        if ($request->hasFile('resultado_pdf')) {
            $file = $request->file('resultado_pdf');
            $filename = 'examen_' . $examen->id_examen . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('examenes_resultados', $filename, 'local');
            
            $estadoFinalizado = \App\Models\Estado::firstOrCreate(['nombre_estado' => 'Atendida']);
            $examen->update([
                'id_estado' => $estadoFinalizado->id_estado,
                'resultado_pdf' => $path 
            ]);

            event(new \App\Events\SystemActivityEvent(
                "Resultado de examen subido: {$examen->paciente->primer_nombre} {$examen->paciente->primer_apellido}",
                'blue',
                'biotech',
                'admin-feed'
            ));

            // Enviar Correo con el PDF adjunto
            try {
                if ($examen->paciente && $examen->paciente->email) {
                    $absolutePath = \Illuminate\Support\Facades\Storage::disk('local')->path($path);
                    \Illuminate\Support\Facades\Mail::to($examen->paciente->email)
                        ->send(new \App\Mail\ResultadoExamenMail($examen, $absolutePath));
                }
            } catch (\Exception $e) {
                // Loggear fallo del email pero no fallar el request
                \Illuminate\Support\Facades\Log::error('Fallo al enviar correo de examen: ' . $e->getMessage());
            }

            return response()->json(['message' => 'Examen atendido y resultados enviados correctamente.', 'success' => true]);
        }

        return response()->json(['message' => 'Debes adjuntar un archivo PDF con los resultados'], 400);
    }

    /**
     * CRUD de Categorías de Examen
     */
    public function obtenerCategorias()
    {
        $categorias = \App\Models\CategoriaExamen::with('estado')->get();
        return response()->json(['success' => true, 'data' => $categorias]);
    }

    public function guardarCategoria(Request $request)
    {
        $request->validate([
            'categoria' => 'required|string|max:100',
            'requiere_ayuno' => 'boolean'
        ]);
        $estadoId = \App\Models\Estado::firstOrCreate(['nombre_estado' => 'Activo'])->id_estado;
        
        $cat = \App\Models\CategoriaExamen::create([
            'categoria' => $request->categoria,
            'requiere_ayuno' => $request->requiere_ayuno ?? false,
            'id_estado' => $estadoId,
        ]);

        return response()->json(['success' => true, 'message' => 'Categoría creada', 'data' => $cat]);
    }

    public function actualizarCategoria(Request $request, int $id)
    {
        $request->validate([
            'categoria' => 'required|string|max:100',
            'requiere_ayuno' => 'boolean'
        ]);
        $cat = \App\Models\CategoriaExamen::findOrFail($id);
        $cat->update([
            'categoria' => $request->categoria,
            'requiere_ayuno' => $request->requiere_ayuno ?? false,
        ]);
        return response()->json(['success' => true, 'message' => 'Categoría actualizada']);
    }

    public function eliminarCategoria(int $id)
    {
        $cat = \App\Models\CategoriaExamen::findOrFail($id);
        // Desactivar en lugar de borrar para mantener integridad relacional
        $estadoInactivo = \App\Models\Estado::firstOrCreate(['nombre_estado' => 'Inactivo'])->id_estado;
        $cat->update(['id_estado' => $estadoInactivo]);
        return response()->json(['success' => true, 'message' => 'Categoría desactivada']);
    }

    /**
     * Permite descargar el resultado PDF de un examen.
     */
    public function descargarResultado($id)
    {
        $examen = \App\Models\Examen::findOrFail($id);

        if (!$examen->resultado_pdf) {
            return response()->json(['message' => 'Este examen no tiene resultados cargados aún.'], 404);
        }

        // Limpiar posible prefijo 'app/' de registros anteriores
        $cleanPath = str_replace('app/', '', $examen->resultado_pdf);

        if (!\Illuminate\Support\Facades\Storage::disk('local')->exists($cleanPath)) {
            return response()->json(['message' => 'El archivo no se encuentra en el servidor.'], 404);
        }

        return \Illuminate\Support\Facades\Storage::disk('local')->download($cleanPath);
    }
}
