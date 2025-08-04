<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
use Illuminate\Http\Request;
use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use Illuminate\Container\Attributes\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BLPedidosController extends Controller
{
    public function index()
    {
        $productos = BlProducto::with(['color', 'empaques.movimientos'])
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'tipo_producto' => $producto->tipo_producto,
                    'tamanio' => $producto->tamanio,
                    'color_nombre' => $producto->color->nombre,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques->sum(function ($empaque) {
                        return $empaque->movimientos->sum('cantidad') * $empaque->cantidad_por_empaque;
                    }),
                ];
            });
        
        $clientes = BLCliente::all();

        return Inertia::render('BLPedidos', [
            'productos' => $productos,
            'colores' => BlColor::all(), // Para formularios
            'user' => auth()->user(),
            'clientes' => $clientes, // Para formularios
        ]);
    }
}
