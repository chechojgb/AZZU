<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivelesEstanteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todas las estanterías existentes
        $estanterias = DB::table('bl_estanterias')->get();
        
        $nivelesData = [];

        foreach ($estanterias as $estanteria) {
            // Crear 3 niveles para cada estantería
            $niveles = [
                [
                    'estanteria_id' => $estanteria->id,
                    'nivel' => 'Bajo',
                    'codigo' => $estanteria->codigo . '-B',
                    'capacidad_maxima' => 10000,
                    'orden' => 1,
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'estanteria_id' => $estanteria->id,
                    'nivel' => 'Medio',
                    'codigo' => $estanteria->codigo . '-M',
                    'capacidad_maxima' => 10000,
                    'orden' => 2,
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'estanteria_id' => $estanteria->id,
                    'nivel' => 'Alto',
                    'codigo' => $estanteria->codigo . '-A',
                    'capacidad_maxima' => 10000,
                    'orden' => 3,
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];

            $nivelesData = array_merge($nivelesData, $niveles);
        }

        // Insertar todos los niveles
        DB::table('bl_niveles_estanteria')->insert($nivelesData);

        $this->command->info('Seeder de niveles ejecutado correctamente:');
        $this->command->info('- ' . count($estanterias) . ' estanterías procesadas');
        $this->command->info('- ' . count($nivelesData) . ' niveles creados');
        $this->command->info('- Capacidad máxima: 10,000 unidades por nivel');
    }
}