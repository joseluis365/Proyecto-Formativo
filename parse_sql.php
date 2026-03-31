<?php

function getTableColumnsFromSql($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }

    $content = file_get_contents($filePath);
    $tables = [];
    
    // Match CREATE TABLE blocks
    // This is a simplified parser for PostgreSQL CREATE TABLE
    if (preg_match_all('/CREATE TABLE public\.(\w+|"[^"]+") \((.*?)\);/s', $content, $matches)) {
        foreach ($matches[1] as $index => $tableName) {
            $tableName = str_replace('"', '', $tableName);
            $block = $matches[2][$index];
            
            $lines = explode("\n", $block);
            $columns = [];
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, 'CONSTRAINT') || str_starts_with($line, '--') || str_starts_with($line, 'ADD CONSTRAINT')) {
                    continue;
                }
                
                if (preg_match('/^(\w+)/', $line, $colMatch)) {
                    $columns[] = $colMatch[1];
                }
            }
            $tables[$tableName] = $columns;
        }
    }
    
    return $tables;
}

$filePath = 'c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\final.sql';
$tables = getTableColumnsFromSql($filePath);

file_put_contents('c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\tmp_sql_schema.json', json_encode($tables, JSON_PRETTY_PRINT));
echo "Successfully wrote to c:\Users\ASUS\OneDrive\Desktop\Proyecto EPS\tmp_sql_schema.json\n";
