<?php

// database/seeders/BlEmpaquesSeeder.php
namespace Database\Seeders;
use App\Models\BlEmpaque;
use Illuminate\Database\Seeder;

class BlEmpaquesSeeder extends Seeder
{
    public function run()
    {
        $empaques = [
            [
                'producto_id' => 1, // Botón Dorado 20MM
                'codigo_unico' => 'BT-1287',
                'cantidad_por_empaque' => 500,
                'codigo_barras' => '123456789',
            ],
            [
                'producto_id' => 2, // Botón Plateado 15MM
                'codigo_unico' => 'BT-1288',
                'cantidad_por_empaque' => 300,
                'codigo_barras' => '987654321',
            ],
        ];

        foreach ($empaques as $empaque) {
            BlEmpaque::create($empaque);
        }
    }
}