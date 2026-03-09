<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Estado;
use App\Models\Usuario;
use App\Http\Requests\StoreCitaRequest;
use App\Http\Requests\UpdateCitaRequest;
use App\Mail\CitaAgendadaMailable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    public function index(Request $request)
    {
        $query = Cita::with(['paciente', 'medico', 'estado', 'tipoCita', 'historialDetalle']);

        if ($request->has('fecha')) {
            $query->where('fecha', $request->fecha);
        }

        if ($request->has('doc_paciente')) {
            $query->where('doc_paciente', $request->doc_paciente);
        }

        if ($request->has('doc_medico')) {
            $query->where('doc_medico', $request->doc_medico);
        }

        return response()->json([
            'message' => 'Citas obtenidas correctamente',
            'data' => $query->get()
        ]);
    }

    public function store(StoreCitaRequest $request)
    {
        // Calcular hora_fin (30 minutos después de hora_inicio)
        $horaInicio = \Carbon\Carbon::createFromFormat('H:i', $request->hora_inicio);
        $horaFin = $horaInicio->copy()->addMinutes(30)->format('H:i');

        // Find or create 'Agendada' state
        $estado = \App\Models\Estado::firstOrCreate(['nombre_estado' => 'Agendada']);

        // Create the appointment
        $cita = Cita::create([
            'doc_paciente' => $request->doc_paciente,
            'doc_medico' => $request->doc_medico,
            'fecha' => $request->fecha,
            'motivo' => $request->motivo,
            'tipo_cita_id' => $request->tipo_cita_id,
            'id_estado' => $estado->id_estado,
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $horaFin,
        ]);

        // Get patient's email to send the confirmation
        $paciente = Usuario::where('documento', $request->doc_paciente)->first();
        if ($paciente && $paciente->email) {
            Mail::to($paciente->email)->send(new CitaAgendadaMailable($cita));
        }

        return response()->json([
            'message' => 'Cita agendada correctamente y notificación enviada',
            'data' => $cita
        ], 201);
    }

    public function update(UpdateCitaRequest $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada'
            ], 404);
        }

        $cita->update($request->validated());

        return response()->json([
            'message' => 'Cita actualizada correctamente',
            'data' => $cita
        ]);
    }

    public function destroy($id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json([
                'message' => 'Cita no encontrada'
            ], 404);
        }

        $cita->delete();

        return response()->json([
            'message' => 'Cita eliminada correctamente'
        ]);
    }
}
