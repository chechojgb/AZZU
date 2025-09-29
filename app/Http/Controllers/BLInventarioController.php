<?php

namespace App\Http\Controllers;


use App\Models\BlEstanteria;
use App\Models\BlInventarioDetalle;
use App\Models\BlProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
                'inventarioDetalle.zona.nivel.estanteria' // ✅ Relación directa
            ])
            ->get()
            ->map(function ($producto) {
                // Obtener todas las ubicaciones donde está este producto
                $ubicaciones = [];
                $zonasUnicas = [];
                $estanteriasUnicas = [];
                
                // ✅ Ahora accedemos directamente desde el producto
                foreach ($producto->inventarioDetalle as $inventario) {
                    if ($inventario->zona && $inventario->zona->nivel && $inventario->zona->nivel->estanteria) {
                        $estanteria = $inventario->zona->nivel->estanteria;
                        $nivel = $inventario->zona->nivel;
                        $zona = $inventario->zona;
                        
                        $ubicacionLegible = $estanteria->nombre . ' - ' . 
                                        $nivel->nivel . ' - ' . 
                                        'Zona ' . $zona->zona;
                        
                        $ubicaciones[] = $ubicacionLegible;
                        
                        $zonasUnicas[] = [
                            'estanteria_nombre' => $estanteria->nombre,
                            'estanteria_codigo' => $estanteria->codigo,
                            'nivel_nombre' => $nivel->nivel,
                            'zona_nombre' => $zona->zona,
                            'codigo_completo' => $zona->codigo_completo
                        ];

                        $estanteriasUnicas[] = $estanteria->codigo;
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
                    'estanterias_codigos' => array_unique($estanteriasUnicas),
                ];
            });

        $estanterias = BlEstanteria::with('niveles.zonaNivel.inventarioDetalle')->get();
        return Inertia::render('BLInventario', [
            'productos' => $productos,
            'estanterias' => $estanterias
        ]);
    }
    public function store(Request $request)
    {
        try {
            // Validar los datos recibidos
            $validated = $request->validate([
                'producto_id' => 'required|exists:bl_productos,id',
                'zona_id' => 'required|exists:bl_zonas_nivel,id',
                'cantidad_actual' => 'required|integer|min:1',
                'fecha_ubicacion' => 'required|date',
                'estado' => 'required|in:disponible,reservado,danado,caducado',
            ]);

            Log::info('Datos validados:', $validated);

            // Buscar si ya existe el inventario en esa zona para ese producto
            $inventarioExistente = BlInventarioDetalle::where('producto_id', $validated['producto_id'])
                ->where('zona_id', $validated['zona_id'])
                ->first();

            Log::info('Inventario existente:', [$inventarioExistente]);

            if ($inventarioExistente) {
                $inventarioExistente->update([
                    'cantidad_actual' => $validated['cantidad_actual'],
                    'fecha_ubicacion' => $validated['fecha_ubicacion'],
                    'estado' => $validated['estado'],
                    'fecha_vencimiento' => $request->fecha_vencimiento,
                    'notas' => $request->notas,
                ]);

                $mensaje = 'Ubicación actualizada correctamente';
            } else {
                // Crear nuevo inventario
                Log::info('Insertando inventario nuevo:', $validated);

                BlInventarioDetalle::create([
                    'producto_id' => $validated['producto_id'],
                    'zona_id' => $validated['zona_id'],
                    'cantidad_actual' => $validated['cantidad_actual'],
                    'fecha_ubicacion' => $validated['fecha_ubicacion'],
                    'fecha_vencimiento' => $request->fecha_vencimiento,
                    'estado' => $validated['estado'],
                    'notas' => $request->notas,
                ]);

                $mensaje = 'Producto ubicado correctamente en el almacén';
            }

            // Actualizar contador de la zona
            $this->actualizarContadorZona($validated['zona_id']);

            return redirect()->back()->with([
                'toast' => [
                    'type' => 'success',
                    'message' => $mensaje,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error en store inventario:', [$e->getMessage()]);

            return redirect()->back()->with([
                'toast' => [
                    'type' => 'error',
                    'message' => 'Error al guardar la ubicación: ' . $e->getMessage(),
                ],
            ]);
        }
    }

    // Método auxiliar para actualizar el contador de la zona
    private function actualizarContadorZona($zonaId)
    {
        $totalProductos = BlInventarioDetalle::where('zona_id', $zonaId)
            ->where('estado', 'disponible')
            ->sum('cantidad_actual');
        DB::table('bl_zonas_nivel')
            ->where('id', $zonaId)
            ->update(['productos_actuales' => $totalProductos]);
    }
}   
