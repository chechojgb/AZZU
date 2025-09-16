<?php

namespace App\Http\Controllers;

use App\Models\BlMovimiento;
use App\Models\BLPedido;
use App\Models\BLPedidoItem;
use App\Models\BlProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $productos = BlProducto::with(['color', 'empaques.movimientos'])
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'tipo_producto' => $producto->tipo_producto,
                    'tamanio' => $producto->tamanio,
                    'color_nombre' => $producto->color->codigo,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques->sum(function ($empaque) {
                        return $empaque->movimientos->sum('cantidad') * $empaque->cantidad_por_empaque;
                    }),
                ];
            })
            ->where('stock_total', '>', 1)
            ->take(10);
        // dd($productos->pluck('descripcion'));
        $rankingProductos = BLPedido::with(['items.empaque.producto'])
            ->get()
            ->flatMap(function ($pedido) {
                return $pedido->items
                    ->filter(fn($item) => $item->empaque)
                    ->map(function ($item) {
                        $cantidad = $item->empaque->cantidad_por_empaque;

                        return [
                            'producto_id' => $item->empaque->producto->id,
                            'nombre'       => $item->empaque->producto->descripcion,
                            'cantidad'     => $cantidad,
                        ];
                    });
            })
            ->groupBy('producto_id')
            ->map(function ($items, $productoId) {
                return [
                    'id'      => $productoId,
                    'nombre'  => $items->first()['nombre'],
                    'cantidad'=> $items->sum('cantidad'),
                ];
            })
            ->sortByDesc('cantidad')
            ->values()
            ->take(5);
        
        $pedidosEspera = BLPedido::get()
            ->where('estado', 'pendiente');
        $movimientos = BlMovimiento::with(['empaque.producto'])->orderByDesc('created_at')->take(6)->get();
        // dd($movimientos);
        $produccion = $this->produccionSemanal();


        return Inertia::render('dashboard', [
            'productos' => $productos,
            'user' => $user,
            'pedidos' => $rankingProductos,
            'pedidosEspera' => $pedidosEspera,
            'movimientos' => $movimientos,
            'produccion' => $produccion
        ]);
    }

public function produccionSemanal()
{
    $dias = [
        'Monday'    => 'Lun',
        'Tuesday'   => 'Mar',
        'Wednesday' => 'Mié',
        'Thursday'  => 'Jue',
        'Friday'    => 'Vie',
        'Saturday'  => 'Sáb',
        'Sunday'    => 'Dom',
    ];

    // Rango de la semana actual (Lunes a Domingo)
    $inicioSemana = \Carbon\Carbon::now('America/Bogota')->startOfWeek();
    $finSemana    = \Carbon\Carbon::now('America/Bogota')->endOfWeek();

    // Obtener registros agrupados por fecha usando updated_at
    $registros = BLPedidoItem::where('estado', 'completado')
        ->whereBetween('updated_at', [$inicioSemana, $finSemana])
        ->get()
        ->groupBy(function ($item) {
            return \Carbon\Carbon::parse($item->updated_at)
                ->setTimezone('America/Bogota')
                ->format('Y-m-d');
        });

    // Crear la estructura de la semana completa
    $data = collect();
    for ($fecha = $inicioSemana->copy(); $fecha <= $finSemana; $fecha->addDay()) {
        $fechaStr = $fecha->format('Y-m-d');
        $grupo = $registros->get($fechaStr, collect());

        $data->push([
            'fecha'      => $fechaStr,
            'dia'        => $dias[$fecha->format('l')],
            'produccion' => $grupo->sum('cantidad_empaques'),
            'timestamps' => $grupo->pluck('updated_at'),
        ]);
    }

    return $data->values();
}




}
