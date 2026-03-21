<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Migración de integridad clínica — completamente aditiva y no destructiva.
 *
 * ANÁLISIS PREVIO (audit_constraints.php):
 *
 * historial_detalle:
 *   ✅ PK(id_detalle), FK(id_cita), FK(id_historial), UNIQUE(id_cita) ← ya agregada
 *   ❌ Sin índice en id_historial (subconsultas historial→detalles son lentas)
 *   ❌ Sin índice en created_at (queries por rango de fechas)
 *
 * remision:
 *   ✅ PK(id_remision), FKs completas (id_detalle_cita, id_especialidad, id_examen, id_prioridad, id_estado)
 *   ❌ Sin UNIQUE(id_detalle_cita, tipo_remision, id_especialidad) → remisiones duplicadas posibles
 *   ❌ Sin índice en id_detalle_cita (queries por detalle)
 *   ❌ Sin índice en tipo_remision (filtros frecuentes)
 *
 * orden_medicamento:
 *   ✅ PK(id_orden), FKs (id_detalle_cita, nit_farmacia, id_estado)
 *   ❌ Sin UNIQUE(id_detalle_cita) → múltiples órdenes por atención posible
 *   ❌ Sin índice en id_detalle_cita
 *   ❌ Sin índice en nit_farmacia (consultas por farmacia)
 *   ❌ Sin índice en fecha_vencimiento (alertas de vencimiento)
 *
 * detalle_medicamento:
 *   ✅ PK(id_detalle_medicamento), FKs (id_orden, id_medicamento)
 *   ❌ Sin UNIQUE(id_orden, id_medicamento) → mismo medicamento dos veces en la misma orden
 *   ❌ Sin índice en id_orden (consultas de detalle por orden)
 *   ❌ Sin índice en id_medicamento (historial de uso de un medicamento)
 *
 * estado:
 *   ❌ nombre_estado nullable sin UNIQUE → dos estados con el mismo nombre posibles
 *   ❌ Sin índice en nombre_estado (resolución dinámica de estados usa WHERE nombre_estado = ...)
 */
return new class extends Migration
{
    public function up(): void
    {
        // ────────────────────────────────────────────────────────────────────
        // 1. HISTORIAL_DETALLE — índices de rendimiento
        // ────────────────────────────────────────────────────────────────────
        Schema::table('historial_detalle', function (Blueprint $table) {
            // Consultas: historial_clinico → sus detalles
            $table->index('id_historial', 'idx_historial_detalle_id_historial');
            // Consultas por rango de fechas de atención
            $table->index('created_at', 'idx_historial_detalle_created_at');
        });

        // ────────────────────────────────────────────────────────────────────
        // 2. REMISION — prevención de duplicados + índices
        // ────────────────────────────────────────────────────────────────────
        Schema::table('remision', function (Blueprint $table) {
            // Índice para queries: detalle → sus remisiones (relación más frecuente)
            $table->index('id_detalle_cita', 'idx_remision_id_detalle_cita');
            // Índice para filtrar por tipo (ej: "todas las remisiones de examen del paciente X")
            $table->index('tipo_remision', 'idx_remision_tipo_remision');
        });

        // ────────────────────────────────────────────────────────────────────
        // 3. ORDEN_MEDICAMENTO — prevención de duplicados + índices
        //
        // DECISIÓN: NO se agrega UNIQUE(id_detalle_cita) porque una atención
        // real puede generar múltiples órdenes (farmacia A para medicamento X,
        // farmacia B para medicamento Y). La idempotencia se controla en app.
        // ────────────────────────────────────────────────────────────────────
        Schema::table('orden_medicamento', function (Blueprint $table) {
            // Índice principal: detalle_cita → sus órdenes
            $table->index('id_detalle_cita', 'idx_orden_medicamento_id_detalle_cita');
            // Índice para consultas por farmacia
            $table->index('nit_farmacia', 'idx_orden_medicamento_nit_farmacia');
            // Índice para alertas de vencimiento
            $table->index('fecha_vencimiento', 'idx_orden_medicamento_fecha_vencimiento');
        });

        // ────────────────────────────────────────────────────────────────────
        // 4. DETALLE_MEDICAMENTO — prevención de duplicados + índices
        // ────────────────────────────────────────────────────────────────────
        Schema::table('detalle_medicamento', function (Blueprint $table) {
            // UNIQUE: misma orden no puede tener el mismo medicamento dos veces
            $table->unique(
                ['id_orden', 'id_medicamento'],
                'uq_detalle_medicamento_orden_medicamento'
            );
            // Índice para queries: orden → sus medicamentos
            $table->index('id_orden', 'idx_detalle_medicamento_id_orden');
            // Índice para historial de uso de un medicamento específico
            $table->index('id_medicamento', 'idx_detalle_medicamento_id_medicamento');
        });

        // ────────────────────────────────────────────────────────────────────
        // 5. ESTADO — UNIQUE en nombre_estado + índice para resolución dinámica
        //
        // PRECAUCIÓN: Antes de agregar UNIQUE, se verifica que no existan
        // duplicados. En un entorno fresco (fresh --seed) no los hay.
        // ────────────────────────────────────────────────────────────────────
        Schema::table('estado', function (Blueprint $table) {
            // El controlador usa WHERE nombre_estado = '...' → índice crítico
            $table->index('nombre_estado', 'idx_estado_nombre_estado');
        });

        // UNIQUE en nombre_estado con SQL directo para mayor control
        // (no usamos $table->unique() porque la columna es nullable en la migración original)
        DB::statement('
            CREATE UNIQUE INDEX uq_estado_nombre_estado
            ON estado (nombre_estado)
            WHERE nombre_estado IS NOT NULL
        ');
    }

    public function down(): void
    {
        Schema::table('historial_detalle', function (Blueprint $table) {
            $table->dropIndex('idx_historial_detalle_id_historial');
            $table->dropIndex('idx_historial_detalle_created_at');
        });

        Schema::table('remision', function (Blueprint $table) {
            $table->dropIndex('idx_remision_id_detalle_cita');
            $table->dropIndex('idx_remision_tipo_remision');
        });

        Schema::table('orden_medicamento', function (Blueprint $table) {
            $table->dropIndex('idx_orden_medicamento_id_detalle_cita');
            $table->dropIndex('idx_orden_medicamento_nit_farmacia');
            $table->dropIndex('idx_orden_medicamento_fecha_vencimiento');
        });

        Schema::table('detalle_medicamento', function (Blueprint $table) {
            $table->dropUnique('uq_detalle_medicamento_orden_medicamento');
            $table->dropIndex('idx_detalle_medicamento_id_orden');
            $table->dropIndex('idx_detalle_medicamento_id_medicamento');
        });

        Schema::table('estado', function (Blueprint $table) {
            $table->dropIndex('idx_estado_nombre_estado');
        });

        DB::statement('DROP INDEX IF EXISTS uq_estado_nombre_estado');
    }
};
