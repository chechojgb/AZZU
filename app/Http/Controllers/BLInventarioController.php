<?php

namespace App\Http\Controllers;

use App\Models\BlEmpaque;
use App\Models\BlEstanteria;
use App\Models\BlInventarioDetalle;
use App\Models\BlProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BLInventarioController extends Controller
{
    // public function index()
    // {
    //     $user = Auth::user();
    //     return Inertia::render('BLInventario', [
    //         'user' => $user,
    //     ]);
    // }
    public function index()
    {
        $productos = BlProducto::with([
                'color', 
                'empaques.inventarioDetalle.posicion.nivel.estanteria'
            ])
            ->get()
            ->map(function ($producto) {
                // Obtener todas las ubicaciones donde está este producto
                $ubicaciones = [];
                foreach ($producto->empaques as $empaque) {
                    foreach ($empaque->inventarioDetalle as $inventario) {
                        if ($inventario->posicion && $inventario->posicion->nivel && $inventario->posicion->nivel->estanteria) {
                            $ubicaciones[] = $inventario->posicion->nivel->estanteria->nombre;
                        }
                    }
                }
                
                // Si no tiene ubicación, mostrar "Sin ubicación"
                $estanteria = !empty($ubicaciones) ? implode(', ', array_unique($ubicaciones)) : 'Sin ubicación';
                
                return [
                    'id' => $producto->id,
                    'tipo_producto' => $producto->tipo_producto,
                    'tamanio' => $producto->tamanio,
                    'color_nombre' => $producto->color->nombre,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques
                        ->where('estado', 'disponible') 
                        ->sum('cantidad_unidades'),
                    'estanteria' => $estanteria,
                    'tiene_ubicacion' => !empty($ubicaciones),
                ];
            });

        return Inertia::render('BLInventario', [
            'productos' => $productos,
        ]);
    }
}
