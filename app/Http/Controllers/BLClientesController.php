<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlProducto;
use App\Models\BlColor;
use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use App\Models\BLCliente; // Assuming you have a Cliente model
// use Illuminate\Container\Attributes\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BLClientesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $clientes = BLCliente::all();
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
        return Inertia::render('BLClientes', [
            'productos' => $productos,
            'colores' => BlColor::all(), // Para formularios
            'user' => $user,
            'clientes' => $clientes, // Para mostrar los clientes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'contacto' => 'required|string|max:50',
            'nit' => 'required|string|max:20|unique:bl_clientes,nit',
            'telefono' => 'required|regex:/^[0-9]{7,15}$/', 
            'email' => 'required|string|email|max:255|unique:bl_clientes,email',
            'ciudad' => 'nullable|string|max:60',
            'direccion' => 'required|string|max:50',
        ]);

        BlCliente::create($validated);

        return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Cliente registrado correctamente',
            ],
        ]);
    }

    public function show($id)
    {
        $clientesDetails = BLCliente::with([
            'pedidos.items.empaque.producto',
        ])
        ->findOrFail($id);
        return response()->json([
            'clientesDetails' => $clientesDetails
        ]);
    }
}
