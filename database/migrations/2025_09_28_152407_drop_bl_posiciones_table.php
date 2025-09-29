<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Eliminar la foreign key en bl_inventario_detalle
        Schema::table('bl_inventario_detalle', function (Blueprint $table) {
            // Si se creó con foreignId('posicion_id')->constrained('bl_posiciones')
            // Laravel por defecto crea la llave con el nombre: bl_inventario_detalle_posicion_id_foreign
            $table->dropForeign(['posicion_id']); 
        });

        // 2. Ahora sí eliminar la tabla
        Schema::dropIfExists('bl_posiciones');
    }

    public function down(): void
    {
        // 1. Restaurar la tabla
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

        // 2. Restaurar la foreign key en bl_inventario_detalle
        Schema::table('bl_inventario_detalle', function (Blueprint $table) {
            $table->foreign('posicion_id')
                ->references('id')
                ->on('bl_posiciones')
                ->onDelete('cascade');
        });
    }
};
