<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cita;
use App\Models\Examen;
use App\Models\Estado;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecordatorioCitaMail;

/**
 * Comando de recordatorios de citas.
 * Ejecuta envio programado de recordatorios pendientes.
 */
class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envía recordatorios de citas y exámenes médicos para el día de mañana';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $manana = Carbon::tomorrow()->toDateString();
        $this->info("Procesando recordatorios para la fecha: {$manana}");

        $estadoAgendada = Estado::where('nombre_estado', 'Agendada')->first();
        if (!$estadoAgendada) {
            $this->error('Estado "Agendada" no encontrado.');
            return Command::FAILURE;
        }

        // Citas (incluye normales y remisiones)
        $citas = Cita::with(['paciente'])
            ->where('fecha', $manana)
            ->where('id_estado', $estadoAgendada->id_estado)
            ->where('recordatorio_enviado', false)
            ->get();

        $citasCount = 0;
        foreach ($citas as $cita) {
            if ($cita->paciente && $cita->paciente->email) {
                Mail::to($cita->paciente->email)->send(new RecordatorioCitaMail($cita, $cita->tipo_evento === 'remision' ? 'remisión' : 'cita'));
                // Actualizar el flag para no enviarlo doble
                $cita->update(['recordatorio_enviado' => true]);
                $citasCount++;
            }
        }
        $this->info("Recordatorios de citas/remisiones enviados: {$citasCount}");

        // Exámenes Médicos
        // Como no guarda el flag 'recordatorio_enviado', el schedule debe correr solo 1 vez al día o este comando asume que se dispara una sola vez diaria para la fecha 'mañana'
        $examenes = Examen::with(['paciente', 'categoriaExamen'])
            ->where('fecha', $manana)
            ->where('id_estado', $estadoAgendada->id_estado)
            ->get();

        $examenesCount = 0;
        foreach ($examenes as $examen) {
            if ($examen->paciente && $examen->paciente->email) {
                Mail::to($examen->paciente->email)->send(new RecordatorioCitaMail($examen, 'examen'));
                $examenesCount++;
            }
        }
        $this->info("Recordatorios de exámenes enviados: {$examenesCount}");

        $this->info("Proceso de recordatorios finalizado.");
        return Command::SUCCESS;
    }
}
