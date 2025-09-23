<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BLInventarioController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('BLInventario', [
            'user' => $user,
        ]);
    }
}
