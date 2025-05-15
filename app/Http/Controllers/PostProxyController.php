<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class PostProxyController extends Controller
{

    public function index($area): JsonResponse
    {
        $response = Http::get("http://10.57.251.181:3003/area/{$area}/estado");
        if (!$response->successful()) {
            return response()->json(['error' => 'No se pudo obtener los datos'], 500);
        }

        $data = $response->json();

        return response()->json($data);
    }

    public function usersTable($area): JsonResponse
    {
        $response = Http::get("http://10.57.251.181:3002/area/{$area}");
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
        $response = Http::get('http://10.57.251.181:3007/extensions/overview');

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
        $channel = $request->input('channel');
        $destiny = $request->input('destiny');

        if (!$channel || !$destiny) {
            return response()->json(['error' => 'Extensión no proporcionada'], 400);
        }


        $response = Http::post('http://10.57.251.181:3006/transferir', [
            'canal' => $channel,
            'destino' => $destiny,
        ]);

        if ($response->successful()) {
            return response()->json(['message' => 'Llamada transferida correctamente']);
        }

        return response()->json(['error' => 'No se pudo transferir la llamada'], 500);
    }

}
