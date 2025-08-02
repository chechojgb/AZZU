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
        Schema::create('bl_empaques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('bl_productos');
            $table->string('codigo_unico', 20)->unique(); // Ej: "1287"
            $table->integer('cantidad_por_empaque');      // Ej: 500
            $table->string('codigo_barras', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_empaques');
    }
};
