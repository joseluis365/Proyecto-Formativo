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

class CitaController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Citas obtenidas correctamente',
            'data' => Cita::with(['paciente', 'medico', 'estado', 'tipoCita'])->get()
        ]);
    }

    public function store(StoreCitaRequest $request)
    {
        // Find or create 'Agendada' state
        $estado = Estado::firstOrCreate(['nombre_estado' => 'Agendada']);

        // Create the appointment
        $cita = Cita::create([
            'doc_paciente' => $request->doc_paciente,
            'doc_medico' => $request->doc_medico,
            'fecha' => $request->fecha,
            'motivo' => $request->motivo,
            'tipo_cita_id' => $request->tipo_cita_id,
            'id_estado' => $estado->id_estado,
            'hora_inicio' => null,
            'hora_fin' => null,
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
