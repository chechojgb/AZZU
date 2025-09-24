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
        Schema::create('bl_posiciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nivel_id')->constrained('bl_niveles_estanteria');
            $table->string('posicion'); // 'Posición 1', 'A1', 'B2'
            $table->string('codigo_completo')->unique(); // Ej: 'EST-001-N1-P01'
            $table->decimal('ancho', 8, 2)->nullable(); // en cm
            $table->decimal('alto', 8, 2)->nullable(); // en cm
            $table->decimal('profundidad', 8, 2)->nullable(); // en cm
            $table->integer('capacidad_maxima')->default(1); // máx empaques
            $table->boolean('ocupada')->default(false);
            $table->boolean('activa')->default(true);
            $table->timestamps();
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
