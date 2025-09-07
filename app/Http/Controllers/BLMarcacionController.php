<?php

namespace App\Http\Controllers;

use App\Models\BLCliente;
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
        $buttonUser = User::where('proyecto', 'Button LoversM')->get();
        return Inertia::render('BLMarcacion', [
            'user' => $user,
            'orderCustomer' => $orderCustomer,
            'buttonUser' => $buttonUser
        ]);
    }
}
