<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'admin@empresa.com'; // I will check this specific generic one first, assuming it exists
$user = \App\Models\Usuario::where('email', $email)->first();

if (!$user) {
    echo "No user found with email $email\n";
    
    // Find one that is blocked
    $user = \App\Models\Usuario::whereHas('empresa', function($q){
        $q->whereHas('licenciaActual', function($q2){
            $q2->whereHas('tipoLicencia', function($q3){
                $q3->where('id_estado', '!=', 1);
            });
        });
    })->first();
    
    if($user) {
        $email = $user->email;
        echo "Found blocked user: $email\n";
    }
}

if ($user) {
    echo "User: " . $user->email . "\n";
    echo "Contrasena hash: " . $user->contrasena . "\n";
    $match = \Illuminate\Support\Facades\Hash::check('password', $user->contrasena) ? 'true' : 'false';
    echo "Checks against 'password': " . $match . "\n";

    if ($user->nit) {
        $empresa = \App\Models\Empresa::with('licenciaActual.tipoLicencia')->find($user->nit);
        if ($empresa && $empresa->licenciaActual) {
            echo "Licencia Estado: " . $empresa->licenciaActual->tipoLicencia->id_estado . "\n";
        } else {
            echo "No licencia actual.\n";
        }
    }
}
