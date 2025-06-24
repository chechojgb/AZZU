require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { Client } = require('ssh2');

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('📡 Cliente conectado');
  ws.send(JSON.stringify({ status: '🟢 Consola lista para conectar' }));

  const ssh = new Client();
  let shellStream;
  let contextBuffer = '';
  let collectingContext = false;

  const cleanContextPart = (text) => {
    return text
      .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.includes('__CTX') && !line.includes('$'))
      .join('')
      .trim();
  };

  ssh
    .on('ready', () => {
      console.log('🔐 Conexión SSH establecida');
      ssh.shell((err, stream) => {
        if (err) {
          ws.send(JSON.stringify({ error: 'Error iniciando shell: ' + err.message }));
          return;
        }

        shellStream = stream;
        stream.write('echo __CTX_START__ && whoami && echo __CTX__ && hostname && echo __CTX__ && pwd && echo __CTX_END__\n');

        stream.on('data', (data) => {
          const text = data.toString();

          if (text.includes('__AUTO_MARK_') && text.includes('__END')) {
            const matched = text.match(/__AUTO_MARK_(\d+)__/);
            const id = matched?.[1];
            if (!id) return;

            const [_, raw] = text.split(`__AUTO_MARK_${id}__`);
            const [content] = raw.split(`__AUTO_MARK_${id}___END`);

            const lines = content
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean);

            const unique = [...new Set(lines)];
            if (unique.length === 1) {
              ws.send(JSON.stringify({ autocomplete: unique[0] }));
            } else if (unique.length > 1) {
              ws.send(JSON.stringify({ suggestions: unique }));
            }
            return;
          }

          if (text.includes('__CTX_START__')) {
            collectingContext = true;
            contextBuffer = '';
            return;
          }

          if (text.includes('__CTX_END__')) {
            collectingContext = false;
            contextBuffer += text;
            const parts = contextBuffer.split('__CTX__');
            const context = {
              user: cleanContextPart(parts[0] || ''),
              host: cleanContextPart(parts[1] || ''),
              cwd: cleanContextPart(parts[2] || ''),
            };
            ws.send(JSON.stringify(context));
            return;
          }

          if (collectingContext) {
            contextBuffer += text;
            return;
          }

          if (!text.includes('__AUTO_MARK_')) {
            ws.send(JSON.stringify({ output: text }));
          }
        });

        stream.stderr.on('data', (data) => {
          ws.send(JSON.stringify({ error: data.toString() }));
        });

        stream.on('close', () => {
          console.log('🔒 Shell cerrada');
          ssh.end();
        });
      });
    })
    .on('error', (err) => {
      console.error('❌ Error SSH:', err.message);
      ws.send(JSON.stringify({ error: 'Fallo SSH: ' + err.message }));
    })
    .connect({
      host: '192.168.20.58',
      port: 22,
      username: 'chechojgb',
      password: '3209925728',
    });

  ws.on('message', (msg) => {
    let command;
    try {
      const parsed = JSON.parse(msg);
      command = parsed.command?.trim();
    } catch {
      command = msg.toString().trim();
    }

    if (!shellStream || !command) return;

    const isInternal = command.startsWith('__AUTO_COMPLETE__') || command.startsWith('__AUTO_SUGGEST__');

    if (isInternal) {
      if (command.startsWith('__AUTO_COMPLETE__')) {
        const prefix = command.replace('__AUTO_COMPLETE__', '').trim();
        const parts = prefix.split(/\s+/);
        const lastWord = parts[parts.length - 1] || '';
        const autoId = Date.now();

        const baseCommand = parts[0];

        let flags = '';
        if (baseCommand === 'cd') {
          flags = '-d';
        } else if (baseCommand === 'cat' || baseCommand === 'less' || baseCommand === 'nano') {
          flags = '-f';
        } else {
          flags = '-d -f';
        }

        const wrapped = `echo __AUTO_MARK_${autoId}__ && compgen ${flags} "${lastWord}" && echo __AUTO_MARK_${autoId}___END`;
        console.log(`🧠 Ejecutando autocompletado con flags ${flags} para: ${lastWord}`);
        shellStream.write(`${wrapped}\n`);
        return;
      }

      if (command.startsWith('__AUTO_SUGGEST__')) {
        shellStream.write('ls -1\n');
        shellStream.once('data', (data) => {
          const lines = data.toString().split('\n').map((l) => l.trim()).filter(Boolean);
          ws.send(JSON.stringify({ suggestions: lines }));
        });
        return;
      }
    }

    shellStream.write(`${command}\n`);
    shellStream.write('echo __CTX_START__ && whoami && echo __CTX__ && hostname && echo __CTX__ && pwd && echo __CTX_END__\n');
  });

  ws.on('close', () => {
    console.log('🔌 Cliente desconectado');
    if (shellStream) shellStream.end();
    ssh.end();
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});