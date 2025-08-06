<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
use Illuminate\Http\Request;
use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use App\Models\BLPedido;
use App\Models\BLPedidoItem;
use App\Models\User;
// use Illuminate\Container\Attributes\DB;
use Illuminate\Support\Facades\DB as FacadesDB;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BLPedidosController extends Controller
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
            'user' => $user,
            'clientes' => $clientes, // Para formularios
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'cliente_id' => 'required|numeric|exists:bl_clientes,id',
            'fecha_acordada' => 'required|date',
            'nota' => 'nullable|string|max:255',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|numeric|exists:bl_productos,id',
            'productos.*.cantidad' => 'required|numeric|min:1'
        ]);

        DB::beginTransaction();

        try {
            // Crear el pedido principal
            $pedido = BLPedido::create([
                'cliente_id' => $validated['cliente_id'],
                'fecha_pedido' => $validated['fecha_acordada'],
                'estado' => 'pendiente',
                'notas' => $validated['nota'] ?? null,
                'usuario_id' => $user->id,
            ]);

            foreach ($validated['productos'] as $producto) {
                $cantidadSolicitada = $producto['cantidad'];

                // Buscar empaques disponibles para ese producto (ordenados por fecha ascendente)
                $empaquesDisponibles = BLEmpaque::where('producto_id', $producto['producto_id'])
                    ->where('estado', 'disponible')
                    ->orderBy('created_at')
                    ->get();

                $itemsPedido = [];
                $cantidadAsignada = 0;

                foreach ($empaquesDisponibles as $empaque) {
                    if ($cantidadAsignada >= $cantidadSolicitada) {
                        break;
                    }

                    $cantidadAsignada += $empaque->cantidad;

                    $itemsPedido[] = [
                        'pedido_id' => $pedido->id,
                        'cantidad_empaques' => $empaque->cantidad,
                        'empaque_id' => $empaque->id,
                        'nota' => null,
                    ];

                    // Marcar empaque como "asignado"
                    $empaque->estado = 'asignado';
                    $empaque->save();
                }

                // Si no se alcanzó la cantidad, se anota en el último ítem
                if ($cantidadAsignada < $cantidadSolicitada && count($itemsPedido) > 0) {
                    $faltante = $cantidadSolicitada - $cantidadAsignada;
                    $itemsPedido[count($itemsPedido) - 1]['nota'] = "Faltan $faltante unidades para completar este pedido";
                }

                // Insertar ítems del producto (si hay alguno)
                if (count($itemsPedido) > 0) {
                    BLPedidoItem::create($itemsPedido);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pedido creado correctamente',
                'pedido_id' => $pedido->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}
