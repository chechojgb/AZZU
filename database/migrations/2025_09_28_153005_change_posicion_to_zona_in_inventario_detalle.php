<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1️⃣ Crear la nueva tabla temporal con la estructura correcta
        Schema::create('bl_inventario_detalle_new', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empaque_id')->constrained('bl_empaques');
            $table->foreignId('zona_id')->constrained('bl_zonas_nivel'); // NUEVO CAMPO
            $table->integer('cantidad_actual')->default(0);
            $table->date('fecha_ubicacion');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['disponible', 'reservado', 'danado', 'caducado'])->default('disponible');
            $table->text('notas')->nullable();
            $table->timestamps();

            $table->unique(['empaque_id', 'zona_id']);
            $table->index(['zona_id', 'estado']);
            $table->index('fecha_vencimiento');
        });

        // 2️⃣ Copiar los datos desde la tabla antigua
        //    Aquí asumimos que existe un mapeo directo posicón_id → zona_id
        //    Si necesitas un mapeo distinto, ajusta el SELECT
        DB::statement('
            INSERT INTO bl_inventario_detalle_new (id, empaque_id, zona_id, cantidad_actual, fecha_ubicacion, fecha_vencimiento, estado, notas, created_at, updated_at)
            SELECT id, empaque_id, posicion_id, cantidad_actual, fecha_ubicacion, fecha_vencimiento, estado, notas, created_at, updated_at
            FROM bl_inventario_detalle
        ');

        // 3️⃣ Eliminar la tabla antigua
        Schema::dropIfExists('bl_inventario_detalle');

        // 4️⃣ Renombrar la nueva tabla con el nombre original
        Schema::rename('bl_inventario_detalle_new', 'bl_inventario_detalle');
    }

    public function down(): void
    {
        // Revertir: volver a la tabla con posicion_id
        Schema::create('bl_inventario_detalle_old', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empaque_id')->constrained('bl_empaques');
            $table->foreignId('posicion_id')->constrained('bl_posiciones');
            $table->integer('cantidad_actual')->default(0);
            $table->date('fecha_ubicacion');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['disponible', 'reservado', 'danado', 'caducado'])->default('disponible');
            $table->text('notas')->nullable();
            $table->timestamps();

            $table->unique(['empaque_id', 'posicion_id']);
            $table->index(['posicion_id', 'estado']);
        });

        DB::statement('
            INSERT INTO bl_inventario_detalle_old (id, empaque_id, posicion_id, cantidad_actual, fecha_ubicacion, fecha_vencimiento, estado, notas, created_at, updated_at)
            SELECT id, empaque_id, zona_id, cantidad_actual, fecha_ubicacion, fecha_vencimiento, estado, notas, created_at, updated_at
            FROM bl_inventario_detalle
        ');

        Schema::dropIfExists('bl_inventario_detalle');
        Schema::rename('bl_inventario_detalle_old', 'bl_inventario_detalle');
    }
};
