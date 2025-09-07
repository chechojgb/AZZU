<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MarcacionController extends Controller
{
        public function store(Request $request)
    {
        // ✅ Validamos los datos que vienen desde React
        $validated = $request->validate([
            'clienteId' => 'required|exists:bl_clientes,id',
            'pedidoId' => 'required|exists:bl_pedidos,id',
            'trabajadorId' => 'required|exists:users,id',
            'itemsMarcados' => 'required|array|min:1',
            'itemsMarcados.*.itemId' => 'required|integer',
            'itemsMarcados.*.referencia' => 'required|string|max:255',
            'itemsMarcados.*.cantidad' => 'required|integer|min:1',
            'itemsMarcados.*.nota' => 'nullable|string|max:500',
            'fecha' => 'required|date',
        ]);

        // ✅ Creamos la marcación
        $marcacion = BLMarcacion::create([
            'cliente_id' => $validated['clienteId'],
            'pedido_id' => $validated['pedidoId'],
            'trabajador_id' => $validated['trabajadorId'],
            'items_marcados' => json_encode($validated['itemsMarcados']), // guardamos array como JSON
            'fecha' => $validated['fecha'],
        ]);

        // ✅ Respuesta para Inertia/React
        return back()->with('success', 'Marcación registrada correctamente.');
    }
}
