<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {

            $table->unsignedBigInteger('id_tipo_licencia')->nullable()->after('nit');
            $table->date('fecha_inicio')->nullable()->after('id_tipo_licencia');
            $table->date('fecha_fin')->nullable()->after('fecha_inicio');
            $table->unsignedBigInteger('id_estado')->nullable()->after('fecha_fin');

            $table->foreign('id_estado')
                ->references('id_estado')
                ->on('estado');

            // si ya existe tipo_licencia
            // $table->foreign('id_tipo_licencia')
            //     ->references('id_tipo_licencia')
            //     ->on('tipo_licencia');
        });
    }

    public function down()
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {
            $table->dropForeign(['id_estado']);
            $table->dropColumn([
                'id_tipo_licencia',
                'fecha_inicio',
                'fecha_fin',
                'id_estado'
            ]);
        });
    }
};
