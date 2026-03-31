<?php

// Re-parsing carefully
$lines = file('c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\tmp_user_data_block.txt');
$inData = false;
$usersCount = 0;
$roles = [];

foreach ($lines as $line) {
    if (strpos($line, 'COPY public.usuario') !== false) {
        $inData = true;
        continue;
    }
    if ($inData) {
        if (trim($line) === '\.') break;
        
        $parts = explode("\t", trim($line));
        if (count($parts) >= 13) {
            $usersCount++;
            $roleId = (int)$parts[12];
            $roles[$roleId] = ($roles[$roleId] ?? 0) + 1;
        }
    }
}

echo "Total users found in block: $usersCount\n";
ksort($roles);
foreach ($roles as $r => $c) {
    echo "Role $r: $c users\n";
}
