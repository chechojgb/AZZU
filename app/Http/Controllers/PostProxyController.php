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
            // Extraer nombre
            $nombre = explode(' ', $texto)[0];

            // Extraer estado (Busy, In call, etc.)
            preg_match_all('/\((.*?)\)/', $texto, $matches);
            $estado = null;
            $pausa = null;

            foreach ($matches[1] as $match) {
                if (str_contains($match, 'paused')) {
                    $pausa = $match; // ej: paused:ACW was 2108 secs ago
                }
                if (in_array($match, ['Busy', 'On Hold', 'In call', 'Ringing', 'Not in use'])) {
                    $estado = $match;
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

        public function pausedExtension(Request $request)
    {
        $extension = $request->input('extension');

        $response = Http::post('http://10.57.251.181:3000/channel/hangup', [
            'channel' => $extension
        ]);

        if ($response->successful()) {
            return response()->json(['message' => 'Extension pausada correctamente']);
        }

        return response()->json(['error' => 'No se pudo colgar el canal'], 500);
    }

}
