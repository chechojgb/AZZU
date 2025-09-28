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
                'empaques.inventarioDetalle.zona.nivel.estanteria'
            ])
            ->get()
            ->map(function ($producto) {
                // Obtener todas las ubicaciones donde está este producto
                $ubicaciones = [];
                $zonasUnicas = [];
                $estanteriasUnicas = []; // NUEVO: para almacenar códigos de estanterías
                
                foreach ($producto->empaques as $empaque) {
                    foreach ($empaque->inventarioDetalle as $inventario) {
                        if ($inventario->zona && $inventario->zona->nivel && $inventario->zona->nivel->estanteria) {
                            $estanteria = $inventario->zona->nivel->estanteria;
                            $nivel = $inventario->zona->nivel;
                            $zona = $inventario->zona;
                            
                            // Crear ubicación legible
                            $ubicacionLegible = $estanteria->nombre . ' - ' . 
                                            $nivel->nivel . ' - ' . 
                                            'Zona ' . $zona->zona;
                            
                            $ubicaciones[] = $ubicacionLegible;
                            
                            // Guardar información de zona única
                            $zonasUnicas[] = [
                                'estanteria_nombre' => $estanteria->nombre,
                                'estanteria_codigo' => $estanteria->codigo, // EST-04, RACK-04, etc.
                                'nivel_nombre' => $nivel->nivel,
                                'zona_nombre' => $zona->zona,
                                'codigo_completo' => $zona->codigo_completo
                            ];

                            // NUEVO: Guardar código de estantería para el plano
                            $estanteriasUnicas[] = $estanteria->codigo;
                        }
                    }
                }
                
                $estanteria = !empty($ubicaciones) ? implode(', ', array_unique($ubicaciones)) : 'Sin ubicación';
                
                return [
                    'id' => $producto->id,
                    'tipo_producto' => $producto->tipo_producto,
                    'tamanio' => $producto->tamanio,
                    'color_nombre' => $producto->color->nombre,
                    'descripcion' => $producto->descripcion,
                    'stock_total' => $producto->empaques
                        ->where('estado', 'disponible') 
                        ->sum('cantidad_por_empaque'), 
                    'estanteria' => $estanteria,
                    'tiene_ubicacion' => !empty($ubicaciones),
                    'ubicaciones_detalladas' => $zonasUnicas,
                    'estanterias' => array_unique(array_column($zonasUnicas, 'estanteria_nombre')),
                    'zonas_completas' => array_unique(array_column($zonasUnicas, 'codigo_completo')),
                    // NUEVO: Array de códigos de estantería para el plano
                    'estanterias_codigos' => array_unique($estanteriasUnicas),
                ];
            });

        return Inertia::render('BLInventario', [
            'productos' => $productos,
        ]);
    }
}
