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
        Schema::create('bl_niveles_estanteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estanteria_id')->constrained('bl_estanterias');
            $table->string('nivel'); // 'Nivel 1', 'Nivel 2', 'Base', 'Alto'
            $table->string('codigo'); // Ej: 'EST-001-N1'
            $table->integer('capacidad_maxima')->default(0);
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->unique(['estanteria_id', 'codigo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_niveles_estanteria');
    }
};
