<?php
namespace Database\Seeders;
// database/seeders/BlMovimientosSeeder.php
use App\Models\BlMovimiento;
use Illuminate\Database\Seeder;

class BlMovimientosSeeder extends Seeder
{
    public function run()
    {
        $movimientos = [
            [
                'empaque_id' => 1, // BT-1287
                'tipo' => 'entrada',
                'cantidad' => 3, // 3 empaques de 500 unidades
                'motivo' => 'compra',
                'usuario_id' => 1, // Asegúrate que exista
                'created_at' => now()
            ],
            [
                'empaque_id' => 2, // BT-1288
                'tipo' => 'entrada',
                'cantidad' => 2, // 2 empaques de 300 unidades
                'motivo' => 'compra',
                'usuario_id' => 1,
                'created_at' => now()
            ]
        ];

        foreach ($movimientos as $movimiento) {
            BlMovimiento::create($movimiento);
        }
    }
}