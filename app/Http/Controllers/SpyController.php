<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpyController extends Controller
{
    public function start(Request $request)
    {
        $target = $request->input('target'); // ejemplo: 7001
        $mode = $request->input('mode');     // normal | whisper

        // Mapeo de modo a número que invoca el ChanSpy
        $spyExtension = match($mode) {
            'normal' => "1245331{$target}",
            'whisper' => "12453143{$target}",
            default => "1245331{$target}",
        };

        // Ejecutamos llamada desde 5300 hacia el número espía en contexto 'calidad'
        $command = "Action: Originate\r\n"
                 . "Channel: SIP/5300\r\n"
                 . "Exten: $spyExtension\r\n"
                 . "Context: calidad\r\n"
                 . "Priority: 1\r\n"
                 . "Callerid: Supervisor<5300>\r\n"
                 . "Async: yes\r\n\r\n";

        $socket = fsockopen('127.0.0.1', 5038, $errno, $errstr, 30);
        if (!$socket) {
            return response()->json(['error' => "No se pudo conectar al AMI: $errstr"], 500);
        }

        fputs($socket, "Action: Login\r\nUsername: tuUsuarioAMI\r\nSecret: tuClaveAMI\r\nEvents: off\r\n\r\n");
        fputs($socket, $command);
        fputs($socket, "Action: Logoff\r\n\r\n");
        fclose($socket);

        return response()->json(['message' => 'Espionaje iniciado']);
    }
}