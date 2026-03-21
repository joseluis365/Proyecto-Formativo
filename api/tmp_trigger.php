<?php
use Illuminate\Support\Facades\DB;

$sql = "
CREATE OR REPLACE FUNCTION prevent_past_cita_edit()
RETURNS trigger AS $$
BEGIN
    IF OLD.fecha < CURRENT_DATE AND NEW.id_estado = OLD.id_estado THEN
        RAISE EXCEPTION 'No se pueden editar citas pasadas';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
";

DB::unprepared($sql);
echo "Trigger updated successfully!\n";
