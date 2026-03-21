<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add using raw SQL to support JSONB type in PostgreSQL
        DB::statement("ALTER TABLE historial_clinico ADD COLUMN IF NOT EXISTS alergias TEXT NULL");
        DB::statement("ALTER TABLE historial_clinico ADD COLUMN IF NOT EXISTS habitos_vida JSONB NULL DEFAULT '{}'");
    }

    public function down(): void
    {
        Schema::table('historial_clinico', function (Blueprint $table) {
            $table->dropColumnIfExists('alergias');
            $table->dropColumnIfExists('habitos_vida');
        });
    }
};
