<?php

namespace App\Http\Controllers;

use App\Models\SshSession;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use App\Models\User;


class SshSessionController extends Controller
{
    public function index()
    {
       return auth()->user()->sshSessions;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'private_key' => 'nullable|string',
            'description' => 'nullable|string',
            'use_private_key' => 'required|boolean',
        ]);

        $data['user_id'] = auth()->id();

        return SshSession::create($data);
    }

    public function show(SshSession $sshSession)
    {
        $this->authorizeAccess($sshSession);
        return $sshSession;
    }

    public function update(Request $request, SshSession $sshSession)
    {
        $this->authorizeAccess($sshSession);

        $data = $request->validate([
            'name' => 'required|string',
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'private_key' => 'nullable|string',
            'description' => 'nullable|string',
            'use_private_key' => 'required|boolean',
        ]);

        $sshSession->update($data);
        return $sshSession;
    }

    public function destroy(SshSession $sshSession)
    {
        $this->authorizeAccess($sshSession);
        $sshSession->delete();
        return response()->noContent();
    }

    protected function authorizeAccess(SshSession $session)
    {
        if ($session->user_id !== auth()->id()) {
            abort(403, 'No autorizado');
        }
    }

}
