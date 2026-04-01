<?php

/*
|--------------------------------------------------------------------------
| Rutas de Consola
|--------------------------------------------------------------------------
| Define comandos Artisan y tareas programadas (scheduler) del backend.
*/

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;
Schedule::command('app:check-licenses')->daily();
Schedule::command('email:reminders')->daily();
