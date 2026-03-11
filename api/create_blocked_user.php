<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Get an active user associated with an empresa that has a license
$user = \App\Models\Usuario::whereHas('empresa', function($q){
    $q->whereHas('licenciaActual');
})->first();

if ($user) {
    echo "Using existing user: " . $user->email . "\n";
    
    // Temporarily set their license status to 6 (Bloqueada)
    $empresa = \App\Models\Empresa::find($user->nit);
    $licencia = $empresa->licenciaActual;
    $tipoLicencia = $licencia->tipoLicencia;
    
    $oldEstado = $tipoLicencia->id_estado;
    $tipoLicencia->id_estado = 6;
    $tipoLicencia->save();
    
    echo "License state changed from $oldEstado to 6 (Bloqueada)\n";
    
    // Let's reset their password to "Password123*" so we know it
    $user->contrasena = \Illuminate\Support\Facades\Hash::make('Password123*');
    $user->save();
    echo "Password forced to Password123*\n";
    
} else {
    echo "No valid user found to test with.\n";
}
