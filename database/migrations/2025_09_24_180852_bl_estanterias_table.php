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
        Schema::create('bl_estanterias', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // Ej: 'EST-001', 'RACK-01'
            $table->string('nombre'); // Ej: 'Estantería Principal', 'Rack de Emergencia'
            $table->string('tipo'); // 'estanteria', 'rack', 'gondola', 'caja', 'pallet'
            $table->string('zona'); // 'Zona A', 'Zona B', 'Recepcion', 'Almacen'
            $table->integer('capacidad_maxima')->default(0); // Número máximo de empaques
            $table->text('descripcion')->nullable();
            $table->boolean('activa')->default(true);
            $table->integer('orden')->default(0); // Para ordenar en la interfaz
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_estanterias');
    }
};
