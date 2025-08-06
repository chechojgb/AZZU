<?php
/** @var \App\Models\User $user */

// app/Http/Controllers/BlProductoController.php
namespace App\Http\Controllers;

use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;


class BlProductoController extends Controller
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
                    'color_nombre' => $producto->color->codigo,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques->sum(function ($empaque) {
                        return $empaque->movimientos->sum('cantidad') * $empaque->cantidad_por_empaque;
                    }),
                ];
            });
        // dd($productos->pluck('descripcion'));

        return Inertia::render('BLProductos', [
            'productos' => $productos,
            'colores' => BlColor::all(), // Para formularios
        ]);
    }

    public function indexAnalisis()
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

        return Inertia::render('BLAnalisis', [
            'productos' => $productos,
            'colores' => BlColor::all(),
            'user' => auth()->user(), // Para formularios
        ]);
    }

    public function indexHistorico()
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
        $historico = BlMovimiento::with(['empaque.producto', 'usuario'])
            ->where('tipo', 'entrada')
            ->get()
            ->map(function ($movimiento) {
                return [
                    'id' => $movimiento->id,
                    'producto' => $movimiento->empaque->producto->tipo_producto,
                    'tamanio' => $movimiento->empaque->producto->tamanio,
                    'color' => $movimiento->empaque->producto->color->nombre,
                    'cantidad' => $movimiento->cantidad,
                    'motivo' => $movimiento->motivo,
                    'usuario' => $movimiento->usuario->name,
                    'fecha' => $movimiento->created_at->format('d-m-Y H:i'),
                    'tipo'=> $movimiento->tipo,
                    'codigo_unico' => $movimiento->empaque->codigo_unico,
                    'cantidad_por_empaque' => $movimiento->empaque->cantidad_por_empaque,
                ];
            });

        return Inertia::render('BLHistorico', [
            'productos' => $productos,
            'colores' => BlColor::all(),
            'user' => auth()->user(),
            'historico' => $historico,
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
            'estado' => 'Disponible'
        ]);

        
        BlMovimiento::create([
            'empaque_id' => $empaque->id, // aqui debe ir el id del empaque creado mas no del producto
            'tipo' => 'entrada',
            'cantidad' => 1,
            'motivo' => 'compra',
            'usuario_id' => $request->user()->id, // Asegúrate de que el usuario esté autenticado
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

        return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Producto actualizado'
            ]
        ]);
    }
}