<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use Database\Seeders\BlColoresSeeder;
use Database\Seeders\BlProductosSeeder;
use Database\Seeders\BlEmpaquesSeeder;
use Database\Seeders\BlMovimientosSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            BlColoresSeeder::class,
            BlProductosSeeder::class,
            BlEmpaquesSeeder::class,
            BlMovimientosSeeder::class,
        ]);
    }
}
