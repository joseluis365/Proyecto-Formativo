<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes / Scheduler
|--------------------------------------------------------------------------
|
| Aquí se definen los comandos Artisan inline y se registran las tareas
| del scheduler. El cron del servidor debe ejecutar cada minuto:
|
|   * * * * * cd /ruta/al/proyecto && php artisan schedule:run >> /dev/null 2>&1
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Tareas programadas ────────────────────────────────────────────────────

// Verifica y actualiza el estado de las licencias y empresas (medianoche)
Schedule::command('app:check-licenses')
    ->daily()
    ->withoutOverlapping();

// Envía recordatorios de citas programadas para el día siguiente (08:00 AM)
// Idempotente: usa el campo `recordatorio_enviado` para no repetir envíos.
Schedule::command('app:send-appointment-reminders')
    ->dailyAt('08:00')
    ->withoutOverlapping()
    ->onSuccess(function () {
        Log::info('[Scheduler] SendAppointmentReminders ejecutado correctamente.');
    })
    ->onFailure(function () {
        Log::error('[Scheduler] SendAppointmentReminders falló durante la ejecución.');
    });
