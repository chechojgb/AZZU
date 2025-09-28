<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventarioDetalleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener empaques con estado 'disponible'
        $empaques = DB::table('bl_empaques')
            ->where('estado', 'disponible')
            ->get();

        if ($empaques->isEmpty()) {
            $this->command->warn('❌ No hay empaques disponibles para asignar a zonas.');
            return;
        }

        // 2. Obtener zonas activas
        $zonas = DB::table('bl_zonas_nivel')
            ->where('activa', true)
            ->get();

        if ($zonas->isEmpty()) {
            $this->command->warn('❌ No hay zonas activas disponibles.');
            return;
        }

        $inventarioData = [];
        $fechaBase = Carbon::now()->subMonths(6); // Fecha base para variar las fechas

        foreach ($empaques as $empaque) {
            // Seleccionar una zona aleatoria
            $zonaAleatoria = $zonas->random();
            
            // Calcular fechas variadas
            $fechaUbicacion = $fechaBase->copy()->addDays(rand(0, 180));
            $fechaVencimiento = $fechaUbicacion->copy()->addMonths(rand(6, 24));
            
            // Determinar estado aleatorio (mayoría disponible)
            $estados = ['disponible', 'disponible', 'disponible', 'reservado', 'disponible'];
            $estado = $estados[array_rand($estados)];

            // Cantidad aleatoria entre 1 y la capacidad máxima de la zona
            $cantidadMaxima = min($empaque->cantidad_disponible ?? 100, $zonaAleatoria->capacidad_maxima);
            $cantidadActual = rand(1, $cantidadMaxima);

            $inventarioData[] = [
                'empaque_id' => $empaque->id,
                'zona_id' => $zonaAleatoria->id,
                'cantidad_actual' => $cantidadActual,
                'fecha_ubicacion' => $fechaUbicacion->format('Y-m-d'),
                'fecha_vencimiento' => $fechaVencimiento->format('Y-m-d'),
                'estado' => $estado,
                'notas' => $this->generarNotasAleatorias($estado),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Limitar a 50 registros para no saturar (puedes ajustar)
            if (count($inventarioData) >= 50) {
                break;
            }
        }

        // 3. Insertar los datos en bl_inventario_detalle
        DB::table('bl_inventario_detalle')->insert($inventarioData);

        // 4. Actualizar el contador de productos_actuales en las zonas
        $this->actualizarContadorZonas();

        $this->command->info('✅ Seeder de inventario detalle ejecutado correctamente:');
        $this->command->info('   - ' . count($inventarioData) . ' registros creados en bl_inventario_detalle');
        $this->command->info('   - Empaques asignados aleatoriamente a zonas disponibles');
        $this->command->info('   - Contadores de zonas actualizados');
        
        // Mostrar algunos ejemplos
        if (count($inventarioData) > 0) {
            $this->command->info('');
            $this->command->info('📋 Ejemplos de registros creados:');
            $ejemplos = array_slice($inventarioData, 0, 3);
            foreach ($ejemplos as $ejemplo) {
                $zonaCodigo = DB::table('bl_zonas_nivel')
                    ->where('id', $ejemplo['zona_id'])
                    ->value('codigo_completo');
                
                $empaqueNombre = DB::table('bl_empaques')
                    ->where('id', $ejemplo['empaque_id'])
                    ->value('nombre');
                
                $this->command->info("   - {$empaqueNombre} → {$zonaCodigo} ({$ejemplo['cantidad_actual']} unidades)");
            }
        }
    }

    /**
     * Generar notas aleatorias basadas en el estado
     */
    private function generarNotasAleatorias(string $estado): ?string
    {
        $notas = [
            'disponible' => [null, 'Stock nuevo', 'Recién ingresado', 'En óptimas condiciones'],
            'reservado' => ['Reservado para pedido #' . rand(1000, 9999), 'Cliente: Cliente ' . rand(1, 10)],
            'danado' => ['Daño en empaque', 'Producto golpeado', 'Requiere revisión'],
            'caducado' => ['Próximo a vencer', 'Requiere rotación'],
        ];

        $opciones = $notas[$estado] ?? [null];
        return $opciones[array_rand($opciones)];
    }

    /**
     * Actualizar el contador de productos_actuales en las zonas
     */
    private function actualizarContadorZonas(): void
    {
        // Obtener el conteo actual por zona
        $conteoPorZona = DB::table('bl_inventario_detalle')
            ->select('zona_id', DB::raw('SUM(cantidad_actual) as total_productos'))
            ->where('estado', 'disponible')
            ->groupBy('zona_id')
            ->get();

        foreach ($conteoPorZona as $conteo) {
            DB::table('bl_zonas_nivel')
                ->where('id', $conteo->zona_id)
                ->update(['productos_actuales' => $conteo->total_productos]);
        }
    }
}