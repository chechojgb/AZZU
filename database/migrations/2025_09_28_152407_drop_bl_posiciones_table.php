<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Eliminar la tabla de manera segura
        Schema::dropIfExists('bl_posiciones');
    }

    public function down(): void
    {
        // En caso de rollback, recrea la tabla si es necesario
        Schema::create('bl_posiciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nivel_id')->constrained('bl_niveles_estanteria');
            $table->string('posicion');
            $table->string('codigo_completo')->unique();
            $table->decimal('ancho', 8, 2)->nullable();
            $table->decimal('alto', 8, 2)->nullable();
            $table->decimal('profundidad', 8, 2)->nullable();
            $table->integer('capacidad_maxima')->default(1);
            $table->boolean('ocupada')->default(false);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });
    }
};
