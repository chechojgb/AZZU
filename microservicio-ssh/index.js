const { Server } = require("ws");
const { Client } = require("ssh2");
const express = require("express");
const axios = require("axios");

const app = express();
const wss = new Server({ port: 3001 });

const sshSessions = new Map(); // Mantenemos conexiones por sessionId

wss.on("connection", (ws) => {
  let shellStream;
  let currentSessionId;

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "init") {
        currentSessionId = data.sessionId;

        if (sshSessions.has(currentSessionId)) {
          console.log("♻️ Reutilizando conexión SSH para sessionId:", currentSessionId);
          const existing = sshSessions.get(currentSessionId);
          shellStream = existing.shell;
          existing.sockets.add(ws);

          // Reenviar datos al nuevo WebSocket
          shellStream.write('\n'); // fuerza redibujo (útil si estaba en vim)
          return;
        }

        // Obtener datos desde Laravel
        const apiUrl = `http://localhost:8000/ssh-session/${currentSessionId}`;
        const response = await axios.get(apiUrl);
        const session = response.data;

        const ssh = new Client();
        const sshConfig = {
          host: session.host,
          port: session.port || 22,
          username: session.username,
        };

        if (session.use_private_key && session.private_key) {
          sshConfig.privateKey = session.private_key;
        } else {
          sshConfig.password = String(session.password || "").trim();
        }

        ssh
          .on("ready", () => {
            console.log("✅ Nueva conexión SSH lista");

            ssh.shell((err, stream) => {
              if (err) {
                return ws.send(JSON.stringify({ output: `❌ Shell error: ${err.message}` }));
              }

              shellStream = stream;

              // Guardar en el mapa
              sshSessions.set(currentSessionId, {
                ssh,
                shell: stream,
                sockets: new Set([ws])
              });

              stream.on("data", (chunk) => {
                for (const socket of sshSessions.get(currentSessionId).sockets) {
                  socket.send(JSON.stringify({ output: chunk.toString() }));
                }
              });

              stream.stderr.on("data", (chunk) => {
                for (const socket of sshSessions.get(currentSessionId).sockets) {
                  socket.send(JSON.stringify({ output: `❗ ${chunk.toString()}` }));
                }
              });

              stream.on("close", () => {
                console.log("❌ Shell cerrado");
                sshSessions.delete(currentSessionId);
              });
            });
          })
          .on("error", (err) => {
            ws.send(JSON.stringify({ output: `❌ Error SSH: ${err.message}` }));
          })
          .connect(sshConfig);
      }

      // Si se está enviando input
      if (data.input && currentSessionId && sshSessions.has(currentSessionId)) {
        const stream = sshSessions.get(currentSessionId).shell;
        stream.write(data.input);
      }
    } catch (err) {
      ws.send(JSON.stringify({ output: `❌ Error: ${err.message}` }));
    }
  });

  ws.on("close", () => {
    // ❌ No cerramos la sesión SSH, solo eliminamos el WebSocket de la lista
    if (currentSessionId && sshSessions.has(currentSessionId)) {
      const session = sshSessions.get(currentSessionId);
      session.sockets.delete(ws);

      // Si no hay sockets abiertos, puedes cerrar la conexión opcionalmente después de un timeout
      if (session.sockets.size === 0) {
        setTimeout(() => {
          if (session.sockets.size === 0) {
            console.log("🧹 Cerrando sesión inactiva:", currentSessionId);
            session.shell.end();
            session.ssh.end();
            sshSessions.delete(currentSessionId);
          }
        }, 30000); // Espera 30s antes de cerrar
      }
    }
  });
});
