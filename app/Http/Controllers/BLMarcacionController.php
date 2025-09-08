<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
use App\Models\BLMarcacion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BLMarcacionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orderCustomer = BLCliente::with('pedidos.items.empaque.producto')->get();
        $buttonUser = User::whereIn('proyecto', ['Button LoversM', 'Button LoversMN'])->get();
        return Inertia::render('BLMarcacion', [
            'user' => $user,
            'orderCustomer' => $orderCustomer,
            'buttonUser' => $buttonUser
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
            'marcaciones.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        foreach ($validated['marcaciones'] as $data) {
            // calcular el costo_total de esta marcación
            $data['costo_total'] = $data['cantidad'] * $data['precio_unitario'];
            // guardar en BD
            BLMarcacion::create($data);
        }

        return redirect()->back()->with('success', 'Marcaciones registradas correctamente.');
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
}
