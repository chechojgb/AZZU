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
use Illuminate\Support\Facades\Log;

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
                    'stock_total' => $producto->empaques
                        ->where('estado', 'disponible') // Filtra solo empaques disponibles
                        ->sum(function ($empaque) {
                            return $empaque->movimientos->sum('cantidad') * $empaque->cantidad_por_empaque;
                    }),
                ];
            })
            ->filter(function ($producto) {
                return $producto['stock_total'] > 0; // Opcional: solo productos con stock
            })
            ->values();
            
        
        $clientes = BLCliente::all();
        $pedidos = BLPedido::with([
            'items.empaque.producto', 'cliente'
        ])->get();

        return Inertia::render('BLPedidos', [
            'productos' => $productos,
            'colores' => BlColor::all(), // Para formularios
            'user' => $user,
            'clientes' => $clientes, // Para formularios
            'pedidos' => $pedidos,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        logger()->info('Iniciando creación de pedido', ['user_id' => $user->id]);

        // Validación de datos
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
            // Crear pedido principal
            $pedido = BLPedido::create([
                'cliente_id' => $validated['cliente_id'],
                'fecha_pedido' => $validated['fecha_acordada'],
                'estado' => 'pendiente',
                'notas' => $validated['nota'] ?? null,
                'usuario_id' => $user->id,
            ]);

            logger()->info('Pedido principal creado', ['pedido_id' => $pedido->id]);

            // Procesar cada producto
            foreach ($validated['productos'] as $producto) {
                $productoId = $producto['producto_id'];
                $cantidadSolicitada = $producto['cantidad'];
                $estadoBuscado = 'disponible';
                $query = BLEmpaque::where('producto_id', $productoId)
                    ->whereRaw('LOWER(estado) = ?', [$estadoBuscado])
                    ->orderBy('created_at');
                if (DB::getDriverName() !== 'sqlite') {
                    $query->lockForUpdate();
                }
                $empaquesDisponibles = $query->get();
                logger()->info('Empaques disponibles', [
                    'producto_id' => $productoId,
                    'count' => $empaquesDisponibles->count(),
                    'ids' => $empaquesDisponibles->pluck('id')
                ]);
                $itemsPedido = [];
                $cantidadAsignada = 0;
                foreach ($empaquesDisponibles as $empaque) {
                    if ($cantidadAsignada >= $cantidadSolicitada) break;
                    $cantidadPorEmpaque = $empaque->cantidad_por_empaque ?? $empaque->cantidad ?? 0;
                    $cantidadRestante = $cantidadSolicitada - $cantidadAsignada;
                    // Por defecto se toma el empaque completo
                    $cantidadParaEsteItem = $cantidadPorEmpaque;
                    $notaItem = null;
                    // Si solo necesitamos una parte de este empaque
                    if ($cantidadRestante < $cantidadPorEmpaque) {
                        $cantidadParaEsteItem = $cantidadRestante;
                        $notaItem = "Bolsa de {$cantidadPorEmpaque}, se toman {$cantidadRestante}, sobran " . ($cantidadPorEmpaque - $cantidadRestante);
                    }
                    $itemsPedido[] = [
                        'cantidad_empaques' => $cantidadParaEsteItem,
                        'empaque_id' => $empaque->id,
                        'nota' => $notaItem,
                    ];
                    $cantidadAsignada += $cantidadParaEsteItem;
                    // Marcar empaque como asignado
                    $empaque->estado = 'asignado';
                    $empaque->save();
                    logger()->info('Empaque asignado', [
                        'empaque_id' => $empaque->id,
                        'cantidad_asignada' => $cantidadParaEsteItem,
                        'nota' => $notaItem
                    ]);
                }
                // Si no hay empaques asignados
                if (empty($itemsPedido)) {
                    logger()->warning('No se asignaron empaques', ['producto_id' => $productoId]);
                } else {
                    $pedido->items()->createMany($itemsPedido);
                    logger()->info('Items creados', [
                        'producto_id' => $productoId,
                        'count' => count($itemsPedido)
                    ]);
                }
            }

            DB::commit();
            return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Pedido creado correctamente.',
            ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            logger()->error('Error al crear pedido', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with([
                'toast' => [
                    'type' => 'error',
                    'message' => 'Error al crear el pedido.',
                ],
            ]);
        }
    }

    public function show($id)
    {
        $pedido = BLPedido::with([
            'items.empaque.producto', 'cliente'
        ])
        ->findOrFail($id);

        return response()->json([
            'pedido' => $pedido
        ]);
    }






}
