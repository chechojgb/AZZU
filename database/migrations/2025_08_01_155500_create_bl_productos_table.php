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
        Schema::create('bl_productos', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_producto', 10);    // Ej: "BT"
            $table->string('tamanio', 10);          // Ej: "20MM"
            $table->foreignId('color_id')->constrained('bl_colores');
            $table->string('descripcion', 100);     // Auto-generado
            $table->timestamps();

            // Índice único: producto único por tipo+tamaño+color
            $table->unique(['tipo_producto', 'tamanio', 'color_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_productos');
    }
};
