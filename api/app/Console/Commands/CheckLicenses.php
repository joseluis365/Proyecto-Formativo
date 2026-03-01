<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckLicenses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-licenses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica y actualiza el estado de las licencias y empresas según la fecha de fin';

    /**
     * Execute the console command.
     */
    public function handle()
{
    $today = now()->startOfDay();
    $licencias = \App\Models\EmpresaLicencia::whereIn('id_estado', [1, 2, 4])->get();

    foreach ($licencias as $licencia) {
        $fechaFin = \Carbon\Carbon::parse($licencia->fecha_fin)->startOfDay();
        
        $nuevoEstado = null;

        if ($fechaFin->isPast()) {
            $nuevoEstado = 5; // Expirada
        } elseif ($fechaFin->lte($today->copy()->addDays(7))) {
            $nuevoEstado = 4; // Expira pronto
        } else {
            $nuevoEstado = 1; // Activa
        }

        if ($nuevoEstado && $licencia->id_estado != $nuevoEstado) {
            // Actualizamos el detalle
            $licencia->update(['id_estado' => $nuevoEstado]);
            
            \App\Models\Empresa::where('nit', $licencia->nit)
                ->update(['id_estado' => $nuevoEstado]);
                
            $this->info("NIT {$licencia->nit} actualizado a estado {$nuevoEstado}");
        }
    }
}
}
