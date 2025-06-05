<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Role;
use App\Models\Area;
use App\Models\AreaRoleUser;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PostProxyController extends Controller
{

    public function index($area): JsonResponse
    {
        if ($area === 'AR_CONSTRUCCIONES' || $area === 'AR_POSTVENTA') {
            $response = Http::get("http://98.85.112.126:13003/area/{$area}/estado");
        }else{
            $response = Http::get("http://10.57.251.181:3002/area/{$area}");
        }

        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }
        $data = $response->json();
        return response()->json($data);
    }

    public function usersTable($area): JsonResponse
    {
        if ($area === 'AR_CONSTRUCCIONES' || $area === 'AR_POSTVENTA') {
            $response = Http::get("http://98.85.112.126:13002/area/{$area}");
        }else{
            $response = Http::get("http://10.57.251.181:3002/area/{$area}");
        }

        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }
        $data = $response->json();
        // Recorremos los elementos y solo modificamos 'member'
        foreach ($data as &$item) {
            if (!isset($item['member'])) continue;
            $texto = $item['member'];
            // Extraer nombre (lo que está antes del primer espacio)
            $nombre = explode(' ', $texto)[0];
            // Extraer estado (palabra entre paréntesis como Busy, Idle, etc.)
            preg_match_all('/\((.*?)\)/', $texto, $matches);
            $estado = null;
            foreach ($matches[1] as $match) {
                if (in_array($match, ['Busy', 'On Hold', 'In call', 'Ringing', 'Not in use'])) {
                    $estado = $match;
                    break;
                }
            }
            // Sobrescribimos el campo member con los nuevos datos
            $item['member'] = [
                'nombre' => $nombre,
                'estado' => $estado,
            ];
        }
        return response()->json($data);
    }

    public function userData($extension): JsonResponse
    {
        $response = Http::get("http://10.57.251.181:3005/extension/info?ext={$extension}");
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }
        $data = $response->json();
        $texto = $data['member'] ?? $data['member2'] ?? null;
        if ($texto) {
            $nombre = explode(' ', $texto)[0];
            preg_match_all('/\((.*?)\)/', $texto, $matches);
            $estado = null;
            $pausa = null;
            foreach ($matches[1] as $match) {
                if (str_contains($match, 'paused')) {
                    $pausa = $match;
                }
                if (in_array($match, ['Busy', 'On Hold', 'In call', 'Ringing', 'Not in use'])) {
                    $estado = $match;
                }
            }
            // Si no encontramos la pausa en el primer texto, revisamos member2
            if (!$pausa && isset($data['member2'])) {
                preg_match_all('/\((.*?)\)/', $data['member2'], $matches2);
                foreach ($matches2[1] as $match) {
                    if (str_contains($match, 'paused')) {
                        $pausa = $match;
                        break;
                    }
                }
            }
            $data['member'] = [
                'nombre' => $nombre,
                'estado' => $estado,
                'pausa' => $pausa,
            ];
        }
        return response()->json($data);
    }

    public function getOverview()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => "No authenticated user."], 401);
        }

        $fullUser = User::with('areaRoles.area')->find($user->id);
        if (!$fullUser) {
            return response()->json(['error' => "Usuario no encontrado."], 404);
        }
        $operationNames = $fullUser->areaRoles
            ->filter(fn($ar) => $ar->area) 
            ->map(fn($ar) => $ar->area->name)
            ->unique()
            ->values();
        $operationAR = ['AR_CONSTRUCCIONES', 'AR_POSTVENTA'];
        $selectedOperation = $operationNames->firstWhere(fn($name) => in_array($name, $operationAR));
        if (!$selectedOperation && $operationNames->isNotEmpty()) {
            $selectedOperation = $operationNames[0];
        }
        $isEspecial = in_array($selectedOperation, $operationAR);
        $endpoint = $isEspecial
            ? 'http://98.85.112.126:13007/extensions/overview'
            : 'http://10.57.251.181:3007/extensions/overview';
        $response = Http::get($endpoint);
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }
        $data = $response->json();
        foreach ($data as &$item) {
            if (!isset($item['member']) || !is_string($item['member'])) continue;
            $texto = $item['member'];
            $partes = explode(' ', $texto);
            $nombre = $partes[0] ?? 'Desconocido';
            preg_match_all('/\((.*?)\)/', $texto, $matches);
            $estado = null;
            foreach ($matches[1] as $match) {
                if (in_array($match, ['Busy', 'On Hold', 'In call', 'Ringing', 'Not in use'])) {
                    $estado = $match;
                    break;
                }
            }
            $item['member'] = [
                'nombre' => $nombre,
                'estado' => $estado,
            ];
        }
        unset($item); 

        return response()->json($data);
    }


    public function chanelHangup(Request $request)
    {
        $channel = $request->input('channel');
        $response = Http::post('http://10.57.251.181:3000/channel/hangup', [
            'channel' => $channel
        ]);
        if ($response->successful()) {
            return response()->json(['message' => 'Canal colgado correctamente']);
        }
        return response()->json(['error' => 'No se pudo colgar el canal'], 500);
    }

    public function pauseExtension(Request $request): JsonResponse
    {
        $extension = $request->input('extension');
        if (!$extension) {
            return response()->json(['error' => 'Extensión no proporcionada'], 400);
        }
        $interface = "SIP/{$extension}";
        $queues = [];
        for ($i = 1; $i <= 120; $i++) {
            $queues[] = 'Q' . str_pad($i, 3, '0', STR_PAD_LEFT);
        }
        $paused = 1;
        $reason = 'ACW';
        $response = Http::post('http://10.57.251.181:3000/queue/pause', [
            'queues' => $queues,
            'interface' => $interface,
            'paused' => $paused,
            'reason' => $reason,
        ]);
        if ($response->successful()) {
            return response()->json(['message' => 'Agente pausado correctamente']);
        }
        return response()->json(['error' => 'No se pudo pausar al agente'], 500);
    }


    public function unpauseExtension(Request $request): JsonResponse
    {
        $extension = $request->input('extension');
        if (!$extension) {
            return response()->json(['error' => 'Extensión no proporcionada'], 400);
        }
        $interface = "SIP/{$extension}";
        $queues = [];
        for ($i = 1; $i <= 120; $i++) {
            $queues[] = 'Q' . str_pad($i, 3, '0', STR_PAD_LEFT);
        }
        $paused = 0;
        $reason = 'ACW';
        $response = Http::post('http://10.57.251.181:3000/queue/pause', [
            'queues' => $queues,
            'interface' => $interface,
            'paused' => $paused,
            'reason' => $reason,
        ]);
        if ($response->successful()) {
            return response()->json(['message' => 'Agente despausado correctamente']);
        }
        return response()->json(['error' => 'No se pudo pausar al agente'], 500);
    }

    public function channelTransfer(Request $request): JsonResponse
    {
        $channel = $request->input('canal');
        $destino = $request->input('destino'); // ← este nombre es el correcto
        if (!$channel || !$destino) {
            return response()->json(['error' => 'Todos los datos no fueron proporcionados'], 400);
        }
        $response = Http::post('http://10.57.251.181:3006/transferir', [
            'canal' => $channel,
            'destino' => $destino, // ← debe mantenerse igual que en Postman
        ]);
        if ($response->successful()) {
            return response()->json(['message' => 'Llamada transferida correctamente']);
        }
        return response()->json(['error' => 'No se pudo transferir la llamada'], 500);
    }

    public function getDonutCalls()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No authenticated user.'], 401);
        }
        $user = User::with('areaRoles.area')->find($user->id);
        $operationNames = $user->areaRoles->map(fn($ar) => $ar->area->name)
                                        ->unique()
                                        ->values();
        // Mapeo de nombre de operación a su operation_id real
        $operationMap = [
            'Soporte' => 1,
            'Tramites' => 2,
            'Movil' => 3,
            'Retencion' => 5,
            'Pruebas' => 18,
            'AR_CONSTRUCCIONES' => 1,
            'AR_POSTVENTA' => 2,
        ];
        // Elegir la primera operación válida encontrada
        $selectedOperation = null;
        foreach ($operationNames as $name) {
            if (isset($operationMap[$name])) {
                $selectedOperation = $operationMap[$name];
                break;
            }
        }
        $selectedOperationName = null;
        foreach ($operationNames as $name) {
            if (isset($operationMap[$name])) {
            $selectedOperationName = $name;
            break;
            }
        }
        if (!$selectedOperation) {
            return response()->json(['error' => 'No se encontró operación válida para este usuario.'], 422);
        }

        // Determinar si la operación requiere endpoint especial para AR o G4
        $operationAR = ['AR_CONSTRUCCIONES', 'AR_POSTVENTA'];
        $isOperationAR = in_array($selectedOperationName, $operationAR);

        $baseUrl = $isOperationAR
            ? "http://98.85.112.126:13011"
            : "http://10.57.251.181:3011";

        $response = Http::get("{$baseUrl}/api/llamadas/hoy?operation_id={$selectedOperation}");

        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos de la API externa.'], 500);
        }
        // Retornar tanto los datos de la API como el selectedOperation
        return response()->json([
            'data' => $response->json(),
            'selectedOperation' => $selectedOperationName,
        ]);
    }

    public function rankingCalls()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No authenticated user.'], 401);
        }
        $user = User::with('areaRoles.area')->find($user->id);
        $operationNames = $user->areaRoles->map(fn($ar) => $ar->area->name)
                                        ->unique()
                                        ->values();
        // Mapeo de nombre de operación a su operation_id real
        $operationMap = [
            'Soporte' => 1,
            'Tramites' => 2,
            'Movil' => 3,
            'Retencion' => 5,
            'Pruebas' => 18,
            'AR_CONSTRUCCIONES' => 1,
            'AR_POSTVENTA' => 2,
        ];
        // Elegir la primera operación válida encontrada
        $selectedOperation = null;
        foreach ($operationNames as $name) {
            if (isset($operationMap[$name])) {
                $selectedOperation = $operationMap[$name];
                break;
            }
        }
        $selectedOperationName = null;
        foreach ($operationNames as $name) {
            if (isset($operationMap[$name])) {
            $selectedOperationName = $name;
            break;
            }
        }
        if (!$selectedOperation) {
            return response()->json(['error' => 'No se encontró operación válida para este usuario.'], 422);
        }
        
        
        $operationAR = ['AR_CONSTRUCCIONES', 'AR_POSTVENTA'];
        $isOperationAR = in_array($selectedOperationName, $operationAR);
        
        $baseUrl = $isOperationAR
        ? "http://98.85.112.126:13009"
        : "http://10.57.251.181:13011";
        
        $response = Http::get("{$baseUrl}/api/llamadas/ranking?operation_id={$selectedOperation}");
        
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos de la API externa.'], 500);
        }
        // Retornar tanto los datos de la API como el selectedOperation
        // dd($response->json());
        return response()->json([
            'data' => $response->json(),
            'selectedOperation' => $selectedOperationName,
        ]);
    }
        
    
    public function getCallsPerOperation()
    {
        $response = Http::get("http://10.57.251.181:3012/llamadas-en-cola");
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos de la API externa.'], 500);
        }
        $data = $response->json();
        return response()->json($data);
    }

    public function operationState($area): JsonResponse
    {
        $response = Http::get("http://10.57.251.181:3014/operacion/{$area}");
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }
        $data = $response->json();
        return response()->json($data);
    }




}
