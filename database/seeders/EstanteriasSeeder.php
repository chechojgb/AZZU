<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstanteriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run() : void
    {
        $estanterias = [
            // Zona de computadores - Racks verticales (1-10)
            [
                'codigo' => 'RACK-01',
                'nombre' => 'reak 1',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40, // 4 niveles × 10 capacidad
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 1,
            ],
            [
                'codigo' => 'RACK-02',
                'nombre' => 'reak 2',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 2,
            ],
            [
                'codigo' => 'RACK-03',
                'nombre' => 'reak 3',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 3,
            ],
            [
                'codigo' => 'RACK-04',
                'nombre' => 'reak 4',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 4,
            ],
            [
                'codigo' => 'RACK-05',
                'nombre' => 'reak 5',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 5,
            ],
            [
                'codigo' => 'RACK-06',
                'nombre' => 'reak 6',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 6,
            ],
            [
                'codigo' => 'RACK-07',
                'nombre' => 'reak 7',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 7,
            ],
            [
                'codigo' => 'RACK-08',
                'nombre' => 'reak 8',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 8,
            ],
            [
                'codigo' => 'RACK-09',
                'nombre' => 'reak 9',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 9,
            ],
            [
                'codigo' => 'RACK-10',
                'nombre' => 'reak 10',
                'tipo' => 'vertical',
                'zona' => 'computadores',
                'capacidad_maxima' => 40,
                'descripcion' => 'Rack vertical zona computadores',
                'activa' => true,
                'orden' => 10,
            ],

            // Zona de materiales - Estanterías horizontales (1-6)
            [
                'codigo' => 'EST-01',
                'nombre' => 'estantería 1',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => 'mat. 10',
                'activa' => true,
                'orden' => 11,
            ],
            [
                'codigo' => 'EST-02',
                'nombre' => 'estantería 2',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => null,
                'activa' => true,
                'orden' => 12,
            ],
            [
                'codigo' => 'EST-03',
                'nombre' => 'estantería 3',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => null,
                'activa' => true,
                'orden' => 13,
            ],
            [
                'codigo' => 'EST-04',
                'nombre' => 'estantería 4',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => null,
                'activa' => true,
                'orden' => 14,
            ],
            [
                'codigo' => 'EST-05',
                'nombre' => 'estantería 5',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => null,
                'activa' => true,
                'orden' => 15,
            ],
            [
                'codigo' => 'EST-06',
                'nombre' => 'estantería 6',
                'tipo' => 'horizontal',
                'zona' => 'materiales',
                'capacidad_maxima' => 40,
                'descripcion' => null,
                'activa' => true,
                'orden' => 16,
            ],
        ];

        foreach ($estanterias as $estanteria) {
            DB::table('bl_estanterias')->insert(array_merge($estanteria, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
