<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
use App\Models\BLMarcacion;
use App\Models\BLPedido;
use App\Models\BLPedidoItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BLMarcacionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orderCustomer = BLCliente::with(['pedidos.items.empaque.producto', 'pedidos.items.marcaciones.trabajador'])->get();
        $buttonUser = User::whereIn('proyecto', ['Button LoversM', 'Button LoversMN'])->get();
        $itemsPedidos = BLPedidoItem::with(['pedido.cliente', 'empaque.producto', 'marcaciones.trabajador'])->get();
        // dd($itemsPedidos, $orderCustomer, $buttonUser);
        // dd($buttonUser);
        return Inertia::render('BLMarcacion', [
            'user' => $user,
            'orderCustomer' => $orderCustomer,
            'buttonUser' => $buttonUser,
            'itemsPedidos' => $itemsPedidos
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'marcaciones' => 'required|array|min:1',
            'marcaciones.*.pedido_item_id' => 'required|exists:bl_pedido_items,id',
            'marcaciones.*.user_id' => 'required|exists:users,id',
            'marcaciones.*.cantidad' => 'required|integer|min:1',
            'marcaciones.*.fecha' => 'required|date',
            'marcaciones.*.pedido_id' => 'required|exists:bl_pedidos,id',
            'marcaciones.*.precio_unitario' => 'nullable|numeric|min:0',
        ]);

        foreach ($validated['marcaciones'] as $data) {
            $data['precio_unitario'] = $data['precio_unitario'] ?? 0;
            // calcular costo_total
            $data['costo_total'] = $data['cantidad'] * $data['precio_unitario'];

            // 1️⃣ Guardar la marcación
            BLMarcacion::create($data);

            // 2️⃣ Actualizar estado del item a "en_proceso"
            DB::table('bl_pedido_items')
                ->where('id', $data['pedido_item_id'])
                ->update(['estado' => 'en_proceso']);
        }

        return redirect()->back()->with('success', 'Marcaciones registradas y items actualizados.');
    }

    public function update(Request $request, $id)
    {
        $registro = BLMarcacion::findOrFail($id);

        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $registro->update([
            'cantidad' => $request->cantidad,
        ]);

        return response()->json([
            'message' => 'Cantidad actualizada correctamente',
            'data' => $registro
        ]);
    }

    public function destroy($id)
    {
        $registro = BLMarcacion::findOrFail($id);
        $registro->delete();

        return response()->json([
            'message' => 'Asignación eliminada correctamente'
        ]);
    }

    public function actualizarEstado(BLPedidoItem $item, Request $request)
    {
        $user = Auth::id();
        $request->validate([
            'estado' => 'required|in:pendiente,en proceso,completado'
        ]);
        $item->estado = $request->estado;
        $item->save();
        $item->movimientos()->create([
            'tipo' => 'pedido', // identificamos que el movimiento es de un pedido
            'cantidad' => $item->cantidad_empaques, // opcional: cantidad afectada
            'motivo' => "Cambio de estado a {$request->estado}", // motivo descriptivo
            'usuario_id' => $user, // usuario que hizo el cambio
        ]);
        return redirect()->back()->with([
            'toast' => [
                'type' => 'success',
                'message' => 'Estado actualizado correctamente',
            ],
        ]);
    }
}
