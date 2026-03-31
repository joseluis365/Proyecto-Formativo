<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Function and Trigger for Admins History
        DB::unprepared("
            CREATE OR REPLACE FUNCTION public.guardar_historial_admins() RETURNS trigger
            LANGUAGE plpgsql
            AS $$
            BEGIN
               IF NEW.id_rol = 2 THEN
                  INSERT INTO historial_admins (
                     documento,
                     primer_nombre,
                     segundo_nombre,
                     primer_apellido,
                     segundo_apellido,
                     email,
                     telefono,
                     contrasena,
                     nit,
                     fecha_respaldo
                  )
                  VALUES (
                     NEW.documento,
                     NEW.primer_nombre,
                     NEW.segundo_nombre,
                     NEW.primer_apellido,
                     NEW.segundo_apellido,
                     NEW.email,
                     NEW.telefono,
                     NEW.contrasena,
                     NEW.nit,
                     CURRENT_TIMESTAMP
                  );
               END IF;
               RETURN NEW;
            END;
            $$;
        ");

        DB::unprepared("
            DROP TRIGGER IF EXISTS trigger_historial_admins ON usuario;
            CREATE TRIGGER trigger_historial_admins 
            AFTER INSERT ON usuario 
            FOR EACH ROW EXECUTE FUNCTION guardar_historial_admins();
        ");

        // 2. Function and Trigger for Enterprise Representative Backup
        DB::unprepared("
            CREATE OR REPLACE FUNCTION public.guardar_historial_empresa() RETURNS trigger
            LANGUAGE plpgsql
            AS $$
            BEGIN
               IF OLD.nombre_representante IS DISTINCT FROM NEW.nombre_representante
                  OR OLD.documento_representante IS DISTINCT FROM NEW.documento_representante
                  OR OLD.telefono_representante IS DISTINCT FROM NEW.telefono_representante
                  OR OLD.email_representante IS DISTINCT FROM NEW.email_representante
               THEN
                  INSERT INTO respaldo_empresa (
                     nit_empresa,
                     nombre_representante,
                     documento_representante,
                     telefono_representante,
                     email_representante,
                     fecha_respaldo
                  )
                  VALUES (
                     OLD.nit,
                     OLD.nombre_representante,
                     OLD.documento_representante,
                     OLD.telefono_representante,
                     OLD.email_representante,
                     CURRENT_TIMESTAMP
                  );
               END IF;
               RETURN NEW;
            END;
            $$;
        ");

        DB::unprepared("
            DROP TRIGGER IF EXISTS trigger_respaldo_empresa ON empresa;
            CREATE TRIGGER trigger_respaldo_empresa 
            BEFORE UPDATE ON empresa 
            FOR EACH ROW EXECUTE FUNCTION guardar_historial_empresa();
        ");

        // 3. Function and Trigger to Prevent Past Appointment Edits
        DB::unprepared("
            CREATE OR REPLACE FUNCTION public.prevent_past_cita_edit() RETURNS trigger
            LANGUAGE plpgsql
            AS $$
            BEGIN
                IF OLD.fecha < CURRENT_DATE AND NEW.id_estado = OLD.id_estado THEN
                    RAISE EXCEPTION 'No se pueden editar citas pasadas';
                END IF;
                RETURN NEW;
            END;
            $$;
        ");

        DB::unprepared("
            DROP TRIGGER IF EXISTS trg_prevent_past_cita_edit ON cita;
            CREATE TRIGGER trg_prevent_past_cita_edit 
            BEFORE UPDATE ON cita 
            FOR EACH ROW EXECUTE FUNCTION prevent_past_cita_edit();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP TRIGGER IF EXISTS trigger_historial_admins ON usuario;");
        DB::unprepared("DROP FUNCTION IF EXISTS guardar_historial_admins();");
        
        DB::unprepared("DROP TRIGGER IF EXISTS trigger_respaldo_empresa ON empresa;");
        DB::unprepared("DROP FUNCTION IF EXISTS guardar_historial_empresa();");
        
        DB::unprepared("DROP TRIGGER IF EXISTS trg_prevent_past_cita_edit ON cita;");
        DB::unprepared("DROP FUNCTION IF EXISTS prevent_past_cita_edit();");
    }
};
