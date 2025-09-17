<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bl_movimientos', function (Blueprint $table) {
            // 1. Eliminar la foreign key y la columna empaque_id
            if (Schema::hasColumn('bl_movimientos', 'empaque_id')) {
                $table->dropForeign(['empaque_id']);
                $table->dropColumn('empaque_id');
            }

            // 2. Cambiar enum tipo a string
            if (Schema::hasColumn('bl_movimientos', 'tipo')) {
                $table->dropColumn('tipo');
            }

            // ✅ Nueva columna tipo como string con valor por defecto
            $table->string('tipo', 50)->default('entrada')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bl_movimientos', function (Blueprint $table) {
            // Restaurar la columna empaque_id
            $table->foreignId('empaque_id')->constrained('bl_empaques')->after('id');

            // Eliminar tipo como string y volverlo enum original
            $table->dropColumn('tipo');
            $table->enum('tipo', ['entrada', 'salida', 'ajuste'])->after('empaque_id');
        });
    }
};
