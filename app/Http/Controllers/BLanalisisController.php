<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use App\Models\BLPedido;
use App\Models\BLPedidoItem;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BLanalisisController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $pedidosMes = BLPedido::whereBetween('created_at', [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        ])->count();
        $cantidadProduccion = BLPedidoItem::where('estado', 'completado')->sum('cantidad_empaques');
        $clientesActivos = BLCliente::get()->count('id');
        $cantidadProductosStock = BlEmpaque::where('estado', 'disponible')->sum('cantidad_por_empaque');
        $rankingClientes = BLCliente::withCount('pedidos')->orderByDesc('pedidos_count')->get();


        return Inertia::render('BLAnalisis', [
            'pedidosMes' => $pedidosMes,
            'cantidadProduccion' => $cantidadProduccion,
            'clientesActivos' => $clientesActivos,
            'cantidadProductosStock' => $cantidadProductosStock,
            'rankingClientes' => $rankingClientes,
            'semanal'    => $this->produccionSemanal(),
            'mensual'    => $this->produccionMensual(),
            'trimestral' => $this->produccionTrimestral(),
            'comparativa' => $this->comparativaPeriodos(),
            'user' => $user, // Para formularios
        ]);
    }

    public function produccionTrimestral()
    {
        $inicioTrimestre = \Carbon\Carbon::now('America/Bogota')->firstOfQuarter();
        $finTrimestre    = \Carbon\Carbon::now('America/Bogota')->lastOfQuarter();

        $registros = BLPedidoItem::where('estado', 'completado')
            ->whereBetween('updated_at', [$inicioTrimestre, $finTrimestre])
            ->get()
            ->groupBy(function ($item) {
                return \Carbon\Carbon::parse($item->updated_at)
                    ->setTimezone('America/Bogota')
                    ->format('Y-m'); // agrupamos por mes
            });

        $meses = [
            '01' => 'Ene',
            '02' => 'Feb',
            '03' => 'Mar',
            '04' => 'Abr',
            '05' => 'May',
            '06' => 'Jun',
            '07' => 'Jul',
            '08' => 'Ago',
            '09' => 'Sep',
            '10' => 'Oct',
            '11' => 'Nov',
            '12' => 'Dic',
        ];

        $data = collect();
        for ($fecha = $inicioTrimestre->copy(); $fecha <= $finTrimestre; $fecha->addMonth()) {
            $mesKey = $fecha->format('Y-m');
            $grupo = $registros->get($mesKey, collect());

            $data->push([
                'fecha'      => $mesKey,
                'mes'        => $meses[$fecha->format('m')],
                'produccion' => $grupo->sum('cantidad_empaques'),
            ]);
        }

        return $data->values();
    }
    public function produccionMensual()
    {
        $inicioMes = \Carbon\Carbon::now('America/Bogota')->startOfMonth();
        $finMes    = \Carbon\Carbon::now('America/Bogota')->endOfMonth();

        $registros = BLPedidoItem::where('estado', 'completado')
            ->whereBetween('updated_at', [$inicioMes, $finMes])
            ->get()
            ->groupBy(function ($item) {
                return \Carbon\Carbon::parse($item->updated_at)
                    ->setTimezone('America/Bogota')
                    ->format('Y-m-d');
            });

        $data = collect();
        for ($fecha = $inicioMes->copy(); $fecha <= $finMes; $fecha->addDay()) {
            $fechaStr = $fecha->format('Y-m-d');
            $grupo = $registros->get($fechaStr, collect());

            $data->push([
                'fecha'      => $fechaStr,
                'dia'        => $fecha->day, // día del mes (1, 2, 3…)
                'produccion' => $grupo->sum('cantidad_empaques'),
            ]);
        }

        return $data->values();
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

        $inicioSemana = \Carbon\Carbon::now('America/Bogota')->startOfWeek();
        $finSemana    = \Carbon\Carbon::now('America/Bogota')->endOfWeek();

        $registros = BLPedidoItem::where('estado', 'completado')
            ->whereBetween('updated_at', [$inicioSemana, $finSemana])
            ->get()
            ->groupBy(function ($item) {
                return \Carbon\Carbon::parse($item->updated_at)
                    ->setTimezone('America/Bogota')
                    ->format('Y-m-d');
            });

        $data = collect();
        for ($fecha = $inicioSemana->copy(); $fecha <= $finSemana; $fecha->addDay()) {
            $fechaStr = $fecha->format('Y-m-d');
            $grupo = $registros->get($fechaStr, collect());

            $data->push([
                'fecha'      => $fechaStr,
                'dia'        => $dias[$fecha->format('l')],
                'produccion' => $grupo->sum('cantidad_empaques'),
            ]);
        }

        return $data->values();
    }
    public function comparativaPeriodos()
    {
        $meses = [
            '01' => 'Enero',
            '02' => 'Febrero',
            '03' => 'Marzo',
            '04' => 'Abril',
            '05' => 'Mayo',
            '06' => 'Junio',
            '07' => 'Julio',
            '08' => 'Agosto',
            '09' => 'Septiembre',
            '10' => 'Octubre',
            '11' => 'Noviembre',
            '12' => 'Diciembre',
        ];

        $ahora = \Carbon\Carbon::now('America/Bogota');
        $mesActual = $ahora->copy()->startOfMonth();
        $mesAnterior = $ahora->copy()->subMonth()->startOfMonth();

        // Producción del mes actual
        $produccionActual = \App\Models\BLPedidoItem::where('estado', 'completado')
            ->whereBetween('updated_at', [$mesActual, $ahora->copy()->endOfMonth()])
            ->sum('cantidad_empaques');

        // Producción del mes anterior
        $produccionAnterior = \App\Models\BLPedidoItem::where('estado', 'completado')
            ->whereBetween('updated_at', [$mesAnterior, $mesAnterior->copy()->endOfMonth()])
            ->sum('cantidad_empaques');

        return [
            [
                'mes'        => $meses[$mesAnterior->format('m')],
                'produccion' => $produccionAnterior,
            ],
            [
                'mes'        => $meses[$mesActual->format('m')],
                'produccion' => $produccionActual,
            ],
        ];
    }



}
