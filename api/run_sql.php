<?php
use Illuminate\Support\Facades\DB;

try {
    DB::statement('ALTER TABLE categoria_examen ADD COLUMN requiere_ayuno BOOLEAN DEFAULT false;');
    echo "categoria_examen altered.\n";
} catch(Exception $e) { echo $e->getMessage() . "\n"; }

try {
    DB::statement('ALTER TABLE examen ADD COLUMN doc_paciente BIGINT;');
    DB::statement('ALTER TABLE examen ADD COLUMN fecha DATE;');
    DB::statement('ALTER TABLE examen ADD COLUMN hora_inicio TIME;');
    DB::statement('ALTER TABLE examen ADD COLUMN hora_fin TIME;');
    DB::statement('ALTER TABLE examen ADD COLUMN id_estado BIGINT;');
    DB::statement('ALTER TABLE examen ADD COLUMN resultado_pdf VARCHAR(255);');
    echo "examen altered.\n";
} catch(Exception $e) { echo $e->getMessage() . "\n"; }

try {
    DB::statement('ALTER TABLE examen ADD CONSTRAINT fk_examen_paciente FOREIGN KEY (doc_paciente) REFERENCES usuario(documento);');
    DB::statement('ALTER TABLE examen ADD CONSTRAINT fk_examen_estado FOREIGN KEY (id_estado) REFERENCES estado(id_estado);');
    echo "FKs added.\n";
} catch(Exception $e) { echo $e->getMessage() . "\n"; }
