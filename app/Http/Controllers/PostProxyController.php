<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class PostProxyController extends Controller
{

    public function index(): JsonResponse
    {
        // Simulación de datos de prueba
        return response()->json([
            'queue'     => rand(4, 10),
            'available' => rand(2, 6),
            'onCall'    => rand(1, 4),
            'paused'    => rand(0, 3),
        ]);
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

    private function randomTimeBetween(int $minSeconds, int $maxSeconds): string
    {
        $seconds = rand($minSeconds, $maxSeconds);
        return gmdate("H:i:s", $seconds);
    }


    public function getOverview()
    {
        $response = Http::get('http://10.57.251.181:3001/extensions/overview');

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


}
