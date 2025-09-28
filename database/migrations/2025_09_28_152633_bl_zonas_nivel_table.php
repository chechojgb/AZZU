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
        Schema::create('bl_zonas_nivel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nivel_id')->constrained('bl_niveles_estanteria');
            $table->string('zona'); // 'A', 'B'
            $table->string('codigo_completo')->unique(); // Ej: 'RACK-01-B-A'
            $table->integer('capacidad_maxima')->default(5000); // mitad de la capacidad del nivel
            $table->integer('productos_actuales')->default(0);
            $table->text('descripcion')->nullable(); // "Frente", "Fondo", etc.
            $table->boolean('activa')->default(true);
            $table->timestamps();
            
            $table->unique(['nivel_id', 'zona']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_zonas_nivel');
    }
};
