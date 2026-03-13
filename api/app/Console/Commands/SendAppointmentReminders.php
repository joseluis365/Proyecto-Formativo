<?php

namespace App\Console\Commands;

use App\Mail\RecordatorioCitaMailable;
use App\Models\Cita;
use App\Models\Estado;
use App\Models\Notificacion;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-appointment-reminders
                            {--dry-run : Muestra qué citas serían procesadas sin enviar nada}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envía recordatorios automáticos a los pacientes con citas programadas para mañana';

    /**
     * Execute the console command.
     *
     * El comando es IDEMPOTENTE: usa el campo `recordatorio_enviado` en la tabla
     * `cita` para garantizar que cada recordatorio se envíe exactamente una vez,
     * sin importar cuántas veces se ejecute el scheduler en el mismo día.
     */
    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $manana   = Carbon::tomorrow()->toDateString();

        // ── 1. Resolver estado "Agendada" dinámicamente (sin IDs hardcodeados) ──
        $estadoAgendada = Estado::where('nombre_estado', 'Agendada')->first();

        if (! $estadoAgendada) {
            $this->error('No se encontró el estado "Agendada" en la base de datos.');
            Log::error('[SendAppointmentReminders] Estado "Agendada" no existe en la tabla estado.');
            return self::FAILURE;
        }

        // ── 2. Buscar citas de mañana que:
        //       - Sean del día siguiente (fecha = mañana)
        //       - Estén en estado "Agendada"
        //       - NO hayan recibido recordatorio aún (recordatorio_enviado = false)
        //    Esto garantiza idempotencia: si el comando se ejecuta dos veces el mismo
        //    día, la segunda pasada no encuentra citas pendientes y sale limpio.
        $citas = Cita::with(['paciente', 'medico', 'tipoCita'])
            ->where('fecha', $manana)
            ->where('id_estado', $estadoAgendada->id_estado)
            ->where('recordatorio_enviado', false)
            ->get();

        if ($citas->isEmpty()) {
            $this->info("No hay citas pendientes de recordatorio para mañana ({$manana}).");
            return self::SUCCESS;
        }

        $this->info("Citas a procesar para mañana ({$manana}): {$citas->count()}");

        if ($isDryRun) {
            $this->warn('[DRY-RUN] Simulación activa — no se enviará ninguna notificación ni se marcará recordatorio_enviado.');
        }

        $processados = 0;
        $emailsOk    = 0;
        $sinEmail    = 0;
        $errores     = 0;

        foreach ($citas as $cita) {
            $paciente = $cita->paciente;

            if (! $paciente) {
                $this->warn("  ⚠  Cita #{$cita->id_cita}: paciente no encontrado, omitida.");
                Log::warning("[SendAppointmentReminders] Cita #{$cita->id_cita} sin paciente asociado.");
                $errores++;
                continue;
            }

            $nombrePaciente = trim("{$paciente->primer_nombre} {$paciente->primer_apellido}");

            if ($isDryRun) {
                $emailInfo = $paciente->email ? "<{$paciente->email}>" : '(sin email)';
                $this->line("  [DRY] Cita #{$cita->id_cita} — {$nombrePaciente} {$emailInfo}");
                $processados++;
                continue;
            }

            // ── 3. Ejecución real: dentro de una transacción por cita ─────────
            DB::beginTransaction();
            try {
                // 3a. Notificación interna
                Notificacion::create([
                    'doc_usuario' => $paciente->documento,
                    'id_cita'     => $cita->id_cita,
                    'titulo'      => 'Recordatorio de cita médica',
                    'mensaje'     => "Tienes una cita médica programada para mañana {$manana} "
                                   . "a las {$cita->hora_inicio}. Recuerda presentarte con anticipación.",
                    'tipo'        => 'recordatorio',
                    'leida'       => false,
                ]);

                // 3b. Marcar la cita como notificada ANTES de enviar el email.
                //     Así, si el envío falla, la notificación interna ya quedó registrada
                //     y el campo marcado evita un reintento que genere un duplicado interno.
                $cita->update(['recordatorio_enviado' => true]);

                DB::commit();
            } catch (\Throwable $e) {
                DB::rollBack();
                $this->error("  ✗  Cita #{$cita->id_cita}: error al crear notificación — {$e->getMessage()}");
                Log::error("[SendAppointmentReminders] Fallo en cita #{$cita->id_cita}", [
                    'error' => $e->getMessage(),
                ]);
                $errores++;
                continue;
            }

            // 3c. Email recordatorio — opcional (si falla NO revierte la transacción,
            //     la notificación interna y el marcado ya son definitivos)
            if ($paciente->email) {
                try {
                    Mail::to($paciente->email)->send(new RecordatorioCitaMailable($cita));
                    $this->line("  ✓  Cita #{$cita->id_cita} — {$nombrePaciente} <{$paciente->email}> notificado.");
                    $emailsOk++;
                } catch (\Throwable $e) {
                    $this->warn("  ⚠  Cita #{$cita->id_cita}: email fallido (notif. interna OK) — {$e->getMessage()}");
                    Log::warning("[SendAppointmentReminders] Email falló para cita #{$cita->id_cita}", [
                        'paciente' => $paciente->documento,
                        'email'    => $paciente->email,
                        'error'    => $e->getMessage(),
                    ]);
                    // NO incrementamos $errores: la notificación interna fue exitosa.
                }
            } else {
                $this->line("  ℹ  Cita #{$cita->id_cita} — {$nombrePaciente}: sin email (solo notif. interna).");
                $sinEmail++;
            }

            $processados++;
        }

        // ── 4. Resumen ─────────────────────────────────────────────────────────
        $this->newLine();
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Fecha objetivo',                $manana],
                ['Citas procesadas',              $processados],
                ['Emails enviados',               $emailsOk],
                ['Sin email (solo notif. intern.)', $sinEmail],
                ['Errores (cita omitida)',         $errores],
                ['Modo',                          $isDryRun ? 'DRY-RUN' : 'REAL'],
            ]
        );

        Log::info('[SendAppointmentReminders] Proceso completado.', [
            'fecha'        => $manana,
            'processados'  => $processados,
            'emails_ok'    => $emailsOk,
            'sin_email'    => $sinEmail,
            'errores'      => $errores,
            'dry_run'      => $isDryRun,
        ]);

        return self::SUCCESS;
    }
}
