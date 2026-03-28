<?php
$sql = file_get_contents(__DIR__.'/../final.sql');

function extractCopyBlock($sql, $tableName) {
    if (preg_match("/^COPY public\." . preg_quote($tableName) . " \(([^)]+)\) FROM stdin;\r?\n(.*?)\r?\n\\\./ms", $sql, $matches)) {
        $cols = array_map('trim', explode(',', $matches[1]));
        $rows = explode("\n", trim($matches[2]));
        $data = [];
        foreach ($rows as $row) {
            $vals = explode("\t", trim($row, "\r"));
            if (count($vals) === count($cols)) {
                $rowArray = [];
                for ($i=0; $i<count($cols); $i++) {
                    $val = trim($vals[$i]);
                    if ($val === '\N') $val = null;
                    else if (is_numeric($val) && strpos($val, '.') === false && strlen($val) < 18) {
                        $val = (int)$val;
                    }
                    else {
                        $val = str_replace("'", "\'", $val);
                    }
                    $rowArray[$cols[$i]] = $val;
                }
                $data[] = $rowArray;
            }
        }
        return ['cols' => $cols, 'data' => $data];
    }
    return null;
}

function buildSeederContent($className, $tableName, $data, $primaryKey = 'id') {
    $content = "<?php\n\nnamespace Database\Seeders;\n\nuse Illuminate\\Database\\Seeder;\nuse Illuminate\\Support\\Facades\\DB;\n\nclass {$className} extends Seeder\n{\n    public function run(): void\n    {\n        \$data = [\n";
    foreach ($data as $row) {
        $content .= "            [\n";
        foreach ($row as $col => $val) {
            if ($val === null) $content .= "                '$col' => null,\n";
            else if (is_int($val)) $content .= "                '$col' => $val,\n";
            else $content .= "                '$col' => '$val',\n";
        }
        $content .= "            ],\n";
    }
    $content .= "        ];\n\n";
    $content .= "        foreach (\$data as \$item) {\n";
    if (is_array($primaryKey)) {
        $pkArray = implode(", ", array_map(function($k) { return "'$k' => \$item['$k']"; }, $primaryKey));
        $content .= "            DB::table('{$tableName}')->updateOrInsert([{$pkArray}], \$item);\n";
    } else {
        $content .= "            DB::table('{$tableName}')->updateOrInsert(['{$primaryKey}' => \$item['{$primaryKey}']], \$item);\n";
    }
    $content .= "        }\n    }\n}\n";
    return $content;
}

$tables = [
    'estado' => ['EstadoSeeder', 'id_estado'],
    'rol' => ['RolSeeder', 'id_rol'],
    'especialidad' => ['EspecialidadSeeder', 'id_especialidad'],
    'tipo_licencia' => ['TipoLicenciaSeeder', 'id_tipo_licencia'],
    'prioridad' => ['PrioridadSeeder', 'id_prioridad'],
    'tipo_cita' => ['TipoCitaSeeder', 'id_tipo_cita'],
    'consultorio' => ['ConsultorioSeeder', 'id_consultorio'],
    'enfermedades' => ['EnfermedadesSeeder', 'codigo_icd'],
];

foreach ($tables as $t => $info) {
    $res = extractCopyBlock($sql, $t);
    if ($res) {
        $code = buildSeederContent($info[0], $t, $res['data'], $info[1]);
        file_put_contents(__DIR__.'/database/seeders/'.$info[0].'.php', $code);
        echo "Created {$info[0]} successfully with " . count($res['data']) . " rows.\n";
    } else {
        echo "Could not find block for $t\n";
    }
}
