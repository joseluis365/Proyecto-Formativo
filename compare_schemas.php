<?php

$sqlSchema = json_decode(file_get_contents('tmp_sql_schema.json'), true);
$dbSchema = json_decode(file_get_contents('tmp_db_schema.json'), true);

$inconsistencies = [];

// Tables from SQL that might be missing or have different columns in DB
foreach ($sqlSchema as $table => $sqlColumns) {
    $dbTable = $table;
    // Handle case sensitivity issues or renaming if necessary, but search for exact match first
    if (!isset($dbSchema[$dbTable])) {
        // Try case-insensitive match
        $found = false;
        foreach ($dbSchema as $dbName => $cols) {
            if (strcasecmp($dbName, $dbTable) === 0) {
                $dbTable = $dbName;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $inconsistencies[$table] = "Table missing in DB";
            continue;
        }
    }

    $dbColumns = $dbSchema[$dbTable];
    $missingInDb = array_diff($sqlColumns, $dbColumns);
    
    // Ignore Laravel specific columns that might not be in SQL (created_at, updated_at, deleted_at)
    // Actually, SQL also has some of them, but DB might have them even if SQL doesn't.
    // The main concern is columns in SQL missing in DB.
    
    if (!empty($missingInDb)) {
        $inconsistencies[$table] = [
            "missing_columns" => array_values($missingInDb)
        ];
    }
}

file_put_contents('inconsistencies.json', json_encode($inconsistencies, JSON_PRETTY_PRINT));
echo "Successfully wrote to inconsistencies.json\n";
