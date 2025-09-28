<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ZonasNivelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los niveles existentes de la tabla bl_niveles_estanteria
        $niveles = DB::table('bl_niveles_estanteria')->get();
        
        $zonasData = [];

        foreach ($niveles as $nivel) {
            // Obtener información de la estantería padre para determinar el tipo
            $estanteria = DB::table('bl_estanterias')
                ->where('id', $nivel->estanteria_id)
                ->first();

            // Determinar descripción basada en el tipo de estantería
            $descripcionZonaA = $estanteria->tipo === 'vertical' ? 'Lado izquierdo' : 'Zona frontal';
            $descripcionZonaB = $estanteria->tipo === 'vertical' ? 'Lado derecho' : 'Zona trasera';

            // Calcular capacidad máxima por zona (mitad de la capacidad del nivel)
            $capacidadPorZona = floor($nivel->capacidad_maxima / 2);

            // Crear 2 zonas (A y B) para cada nivel
            $zonas = [
                [
                    'nivel_id' => $nivel->id,
                    'zona' => 'A',
                    'codigo_completo' => $nivel->codigo . '-A',
                    'capacidad_maxima' => $capacidadPorZona,
                    'productos_actuales' => 0,
                    'descripcion' => $descripcionZonaA,
                    'activa' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'nivel_id' => $nivel->id,
                    'zona' => 'B',
                    'codigo_completo' => $nivel->codigo . '-B',
                    'capacidad_maxima' => $capacidadPorZona,
                    'productos_actuales' => 0,
                    'descripcion' => $descripcionZonaB,
                    'activa' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];

            $zonasData = array_merge($zonasData, $zonas);
        }

        // Insertar todas las zonas
        DB::table('bl_zonas_nivel')->insert($zonasData);

        $this->command->info('✅ Seeder de zonas de nivel ejecutado correctamente:');
        $this->command->info('   - ' . count($niveles) . ' niveles procesados');
        $this->command->info('   - ' . count($zonasData) . ' zonas creadas (A y B por cada nivel)');
        $this->command->info('   - Capacidad por zona: calculada automáticamente según el nivel');
        
        // Mostrar algunos ejemplos de códigos generados
        if (count($zonasData) > 0) {
            $this->command->info('');
            $this->command->info('📋 Ejemplos de códigos generados:');
            $this->command->info('   - ' . $zonasData[0]['codigo_completo']);
            $this->command->info('   - ' . $zonasData[1]['codigo_completo']);
            $this->command->info('   - ' . $zonasData[4]['codigo_completo']);
            $this->command->info('   - ' . $zonasData[5]['codigo_completo']);
        }
    }
}