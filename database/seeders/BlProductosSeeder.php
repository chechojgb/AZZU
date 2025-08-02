<?php
namespace Database\Seeders;
// database/seeders/BlProductosSeeder.php
use App\Models\BlProducto;
use Illuminate\Database\Seeder;

class BlProductosSeeder extends Seeder
{
     public function run()
    {
        $productos = [
            [
                'tipo_producto' => 'BT',
                'tamanio' => '20MM',
                'color_id' => 1, // Dorado (Z6)
                'descripcion' => 'Botón metálico dorado 20MM', // Añade esto
            ],
            [
                'tipo_producto' => 'BT',
                'tamanio' => '15MM',
                'color_id' => 2, // Plateado (A3)
                'descripcion' => 'Botón metálico plateado 15MM', // Añade esto
            ],
        ];

        foreach ($productos as $producto) {
            BlProducto::create($producto);
        }
    }
}