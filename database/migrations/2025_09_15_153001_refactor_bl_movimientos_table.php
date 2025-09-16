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
            // Agregar la columna movible_id si no existe
            if (!Schema::hasColumn('bl_movimientos', 'movible_id')) {
                $table->unsignedBigInteger('movible_id')->nullable()->after('id');
            }

            // Agregar la columna movible_type si no existe
            if (!Schema::hasColumn('bl_movimientos', 'movible_type')) {
                $table->string('movible_type')->nullable()->after('movible_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bl_movimientos', function (Blueprint $table) {
            // Eliminar la columna movible_id si existe
            if (Schema::hasColumn('bl_movimientos', 'movible_id')) {
                $table->dropColumn('movible_id');
            }

            // Eliminar la columna movible_type si existe
            if (Schema::hasColumn('bl_movimientos', 'movible_type')) {
                $table->dropColumn('movible_type');
            }
        });
    }
};
