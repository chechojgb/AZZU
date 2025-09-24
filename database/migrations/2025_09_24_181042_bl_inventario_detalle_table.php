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
        Schema::create('bl_inventario_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empaque_id')->constrained('bl_empaques');
            $table->foreignId('posicion_id')->constrained('bl_posiciones');
            $table->integer('cantidad_actual')->default(0);
            $table->date('fecha_ubicacion');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['disponible', 'reservado', 'danado', 'caducado'])->default('disponible');
            $table->text('notas')->nullable();
            $table->timestamps();
            
            $table->unique(['empaque_id', 'posicion_id']); // Un empaque no puede estar dos veces en misma posición
            $table->index(['posicion_id', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
