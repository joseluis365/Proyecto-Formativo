<?php

$json = file_get_contents('tmp_categorized_users.json');
$usersByRole = json_decode($json, true);

echo "Users by Role ID:\n";
foreach ($usersByRole as $roleId => $users) {
    echo "Role $roleId: " . count($users) . " users\n";
}

// Get all specialties
require 'api/vendor/autoload.php';
$app = require_once 'api/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$specialties = DB::table('especialidad')->pluck('especialidad', 'id_especialidad')->toArray();
echo "\nTotal Specialties: " . count($specialties) . "\n";
foreach ($specialties as $id => $name) {
    echo "ID $id: $name\n";
}
