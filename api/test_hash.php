<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\Usuario::where('email', 'joseluis1409rodrigu@gmail.com')->first();
$plain = 'Password123*';
echo "Hash DB: " . $user->contrasena . "\n";
echo "Hash Verify: " . (\Illuminate\Support\Facades\Hash::check($plain, $user->contrasena) ? 'true' : 'false') . "\n";

// Let's really manually recreate it using the app's hash algorithm
$user->contrasena = \Illuminate\Support\Facades\Hash::make('Password123*');
$user->save();
echo "Rehashed and saved.\n";
echo "New Hash Verify: " . (\Illuminate\Support\Facades\Hash::check($plain, $user->contrasena) ? 'true' : 'false') . "\n";
