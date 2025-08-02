<?php

// database/seeders/BlColoresSeeder.php
namespace Database\Seeders;

use App\Models\BlColor;
use Illuminate\Database\Seeder;

class BlColoresSeeder extends Seeder
{
    public function run()
    {
        $colores = [
            ['codigo' => 'Z6', 'nombre' => 'Dorado'],
            ['codigo' => 'A3', 'nombre' => 'Plateado'],
            ['codigo' => 'R2', 'nombre' => 'Rojo'],
            ['codigo' => 'N1', 'nombre' => 'Negro'],
            ['codigo' => 'B5', 'nombre' => 'Azul'],
        ];

        foreach ($colores as $color) {
            BlColor::create($color);
        }
    }
}