<?php

// Script to extract the user block cleanly
$handle = fopen('c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\final.sql', 'r');
$out = fopen('c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\tmp_raw_users.txt', 'w');
$inData = false;

while (($line = fgets($handle)) !== false) {
    if (strpos($line, 'COPY public.usuario') !== false) {
        $inData = true;
        continue;
    }
    if ($inData) {
        if (trim($line) === '\.') {
            $inData = false;
            break;
        }
        fwrite($out, $line);
    }
}

fclose($handle);
fclose($out);

echo "Cleanly extracted users to tmp_raw_users.txt\n";
