<?php
/** @var \App\Models\User $user */

// app/Http/Controllers/BlProductoController.php
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

class BlProductoController extends Controller
{
    public function index()
    {
        $productos = BlProducto::with(['color', 'empaques'])
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'tipo_producto' => $producto->tipo_producto,
                    'tamanio' => $producto->tamanio,
                    'color_nombre' => $producto->color->nombre,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques
                        ->where('estado', 'disponible') 
                        ->sum('cantidad_por_empaque'), 
                ];
            });
        // dd($productos->pluck('descripcion'));

        return Inertia::render('BLProductos', [
            'productos' => $productos,
            'colores' => BlColor::all(), // Para formularios
        ]);
    }


    public function indexHistorico()
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
        $entrada = BlMovimiento::with(['movible.producto', 'usuario'])
        ->where('tipo', 'entrada')->get();
        $marcacion = BlMovimiento::with(['movible', 'usuario'])
            ->where('tipo', 'pedido')
            ->whereIn('motivo', [
                'Cambio de estado a en proceso',
                'Cambio de estado a completado'
            ])
            ->get();
        // dd($marcacion);
        $entrega = BLPedido::with('cliente')->where('estado', 'entregado')->get();

        return Inertia::render('BLHistorico', [
            'productos' => $productos,
            'colores' => BlColor::all(),
            'user' => $user,
            'marcacion' => $marcacion,
            'entrada' => $entrada,
            'entrega' => $entrega
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_producto' => 'required|string|max:10',
            'tamanio' => 'required|string|max:10',
            'color_id' => 'required|exists:bl_colores,id',
            'cantidad_por_empaque' => 'required|integer|min:1',
            'codigo_barras' => 'nullable|string|unique:bl_empaques,codigo_barras',
            'codigo_unico' => 'nullable|string|max:255', // si se necesita un código único
        ]);

        // 1. Buscar si ya existe el producto
        $producto = BlProducto::where('tipo_producto', $validated['tipo_producto'])
            ->where('tamanio', $validated['tamanio'])
            ->where('color_id', $validated['color_id'])
            ->first();

        // 2. Si no existe, crearlo
        if (!$producto) {
            $color = BlColor::find($validated['color_id']);
            $descripcion = sprintf('%s %s %s',
                $validated['tipo_producto'],
                $validated['tamanio'],
                $color->codigo
            );

            // dd($descripcion);
            $producto = BlProducto::create([
                'tipo_producto' => $validated['tipo_producto'],
                'tamanio' => $validated['tamanio'],
                'color_id' => $validated['color_id'],
                'descripcion' => $descripcion,
            ]);
        }

        // 3. Registrar el ingreso (bolsa)
        $empaque = BlEmpaque::create([
            'producto_id' => $producto->id,
            'cantidad_por_empaque' => $validated['cantidad_por_empaque'],
            'codigo_barras' => $validated['codigo_barras'],
            'codigo_unico' => $validated['codigo_unico'],
            'estado' => 'disponible'
        ]);

        
        BlMovimiento::create([
            'movible_id' => $empaque->id, 
            'movible_type' => \App\Models\BLEmpaque::class,
            'tipo' => 'entrada',
            'cantidad' => 1,
            'motivo' => 'compra',
            'usuario_id' => $request->user()->id,
        ]);

        return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Ingreso registrado correctamente',
            ],
        ]);
    }

    public function storeColor(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:10',
            'nombre' => 'required|string|max:20',
        ]);

        // 1. Buscar si ya existe el producto
        $producto = BlColor::where('codigo', $validated['codigo'])
            ->first();
        // 2. Si no existe, crearlo
        if (!$producto) {
            $producto = BlColor::create([
                'codigo' => $validated['codigo'],
                'nombre' => $validated['nombre']
            ]);
        }else {
            return redirect()->back()->with([
            'toast' => [
                'type' => 'error',
                'message' => 'Ese color ya está registrado.',
            ],
        ]);
           
        }
        return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Color guardado correctamente',
            ],
        ]);
        
    }

    public function update(Request $request, BlProducto $producto)
    {
        $producto->update($request->validate([
            'tipo_producto' => 'required|string|max:10',
            'tamanio' => 'required|string|max:10',
            'color_id' => 'required|exists:bl_colores,id',
        ]));

        return redirect()->back()->with('success', 'Producto actualizado correctamente');
    }

    public function show($id)
    {
        $productDetails = BlProducto::with(['color'])
        ->findOrFail($id);
        $colores = BlColor::get();
        return response()->json([
            'productDetails' => $productDetails,
            'colores' => $colores
        ]);
    }
}