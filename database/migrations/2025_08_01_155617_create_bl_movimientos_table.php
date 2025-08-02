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
        Schema::create('bl_movimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empaque_id')->constrained('bl_empaques');
            $table->enum('tipo', ['entrada', 'salida', 'ajuste']);
            $table->integer('cantidad'); // Nº de empaques (no unidades)
            $table->string('motivo', 50)->nullable(); // Ej: "compra", "venta"
            $table->string('lote', 20)->nullable();
            $table->foreignId('usuario_id')->constrained('users'); // Opcional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_movimientos');
    }
};
