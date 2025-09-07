<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\BLClientesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostProxyController;
use App\Http\Controllers\SshSessionController;
use App\Http\Controllers\BlProductoController;
use App\Http\Controllers\BlEmpaqueController;
use App\Http\Controllers\BLMarcacionController;
use App\Http\Controllers\BlMovimientoController;
use App\Http\Controllers\BLPedidosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MarcacionController;
use App\Models\BLPedido;
use App\Models\BlProducto;
use App\Models\SshSession;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth;
use Tests\Feature\DashboardTest;

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/AR', function () {
    return Inertia::render('WelcomeAR');
})->name('homeAR');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     // return Inertia::render('dashboard');
    //     return Inertia::render('dashboard', [
    //         $user = Auth::user(),
    //         $productos = BlProducto::get(),
    //         'user' => $user,
    //         'productos' => $productos,
    //     ]);
    // })->name('dashboard');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('perfil', function () {
        return Inertia::render('Perfil');
    })->name('perfil');
    Route::get('showTableAgents', function () {
        return Inertia::render('showTableAgents');
    })->name('showTableAgents');
    Route::get('editAgent/{agent}', function ($agent) {
        return Inertia::render('editAgent', [
            'agent' => $agent
        ]);
    })->name('editAgent');


    Route::get('editAgent/{agent}', function ($agent) {
        return Inertia::render('editAgent', [
            'agent' => $agent
        ]);
    })->name('editAgent');


    //DATA INFORME
    Route::get('showAgentRankingState', function () {
        return Inertia::render('agentState');
    })->name('showAgentRankingState');
    Route::get('showCallState', function () {
        return Inertia::render('callState');
    })->name('showCallState');
    Route::get('showOperationState', function () {
        return Inertia::render('operationState');
    })->name('showOperationState');





    // USUARIOS
    Route::get('users', function () {
        return Inertia::render('users/index');
    })->name('users');
    Route::get('users/create', function () {
        return Inertia::render('users/create');
    })->name('users-create');
    Route::get('users/index', [UserController::class, 'index'])->name('user_index');
    Route::get('users/creates', [UserController::class, 'create'])->name('user_creates');
    Route::post('users.store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::get('/user/data', [UserController::class, 'data']);

    // AREAS
    Route::get('areas', function () {
        return Inertia::render('areas/index');
    })->name('areas');
    Route::get('areas/create', function () {
        return Inertia::render('areas/create');
    })->name('areas-create');
    Route::get('areas/index', [AreaController::class, 'index'])->name('user_index');
    Route::post('areas.store', [AreaController::class, 'store'])->name('areas.store');
    Route::get('/areas/{id}/show', [AreaController::class, 'show']);
    Route::put('/areas/{id}/edit', [AreaController::class, 'update']);




    Route::get('/escuchar', function () {
        $ext = request('ext', '7001'); // extensión por defecto
        $comando = "asterisk -x \"channel originate SIP/5300 extension 12453143{$ext}@from-internal\"";
        $output = shell_exec($comando);
        return response()->json(['status' => 'OK', 'output' => $output])
                        ->header('Access-Control-Allow-Origin', '*');
    });

    Route::get('/getDonutCalls', [PostProxyController::class, 'getDonutCalls']);
    Route::get('/getAgentRanking', [PostProxyController::class, 'rankingCalls']);
    Route::get('/getOverview', [PostProxyController::class, 'getOverview']);

    Route::get('/mi-ip', function () {
        return request()->ip(); // o $_SERVER['REMOTE_ADDR']
    });


    Route::get('test-terminal', function () {
        return Inertia::render('TestTerminal');
    })->name('test-terminal');
    Route::get('terminal-admin', function () {
        return Inertia::render('terminalAdmin');
    })->name('terminal-admin');

    Route::get('terminal/index', [SshSessionController::class, 'index'])->name('terminal_index');
    Route::post('terminal.store', [SshSessionController::class, 'store'])->name('terminal.store');
    Route::get('/terminal/{sshSession}/show', [SshSessionController::class, 'show']);
    Route::put('/terminal/{sshSession}/edit', [SshSessionController::class, 'update']);




    Route::get('/terminales/{id}', function ($id) {
        $session = SshSession::findOrFail($id);
        return Inertia::render('XTermSSH', [
            'session' => $session,
        ]);
    });

    Route::get('/ssh-session/{id}', function ($id) {
        return response()->json(App\Models\SshSession::findOrFail($id));
    });

    route::get('/hoja-cv', function () {
        return view('hoja-cv');
    })->name('hoja-cv');


    //BUTTON LOVERS

    Route::prefix('BLproductosInventario')->group(function () {
        Route::get('BLProductos', [BlProductoController::class, 'index'])->name('productos.index');
        Route::get('colores', [BlProductoController::class, 'index'])->name('colores.index');
        Route::get('BLPedidos', [BLPedidosController::class, 'index'])->name('pedidos.index');
        Route::get('BLClientes', [BLClientesController::class, 'index'])->name('clientes.index');
        Route::get('BLAnalisis', [BlProductoController::class, 'indexAnalisis'])->name('analisis.index');
        Route::get('BLHistorico', [BlProductoController::class, 'indexHistorico'])->name('historico.index');
        Route::post('clientes', [BLClientesController::class, 'store'])->name('clientesBL.store');
        Route::post('productos', [BlProductoController::class, 'store'])->name('productosBL.store');
        Route::post('pedidos', [BLPedidosController::class, 'store'])->name('pedidosBL.store');
        Route::post('colores', [BlProductoController::class, 'storeColor'])->name('coloresBL.store');
        Route::get('BLPedidosShow/{id}', [BLPedidosController::class, 'show'])->name('pedidosBL.show');
        Route::get('BLClientesShow/{id}', [BLClientesController::class, 'show'])->name('ClientesBL.show');
        Route::get('BLProductShow/{id}', [BlProductoController::class, 'show'])->name('ProductBL.show');
        Route::post('cliente/{cliente}', [BLClientesController::class, 'update'])->name('clientesBL.update');
        Route::put('productos/{producto}', [BlProductoController::class, 'update'])->name('productBL.update');
        Route::get('BLMarcacion', [BLMarcacionController::class, 'index'])->name('marcacion.index');
        Route::post('/bl_marcaciones', [MarcacionController::class, 'store'])->name('bl_marcaciones.store');
    });
});

