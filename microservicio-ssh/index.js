const { Server } = require("ws");
const express = require("express");
const axios = require("axios");
const {
  createSSHProcess,
  getSession,
  resizeSession,
  cleanupSocket,
} = require("./ssh/ptyManager");

const app = express();
const wss = new Server({ port: 3001 });

console.log("🚀 Servidor WebSocket listo en ws://localhost:3001");

wss.on("connection", (ws) => {
  console.log("🔌 Nueva conexión WebSocket");

  let currentSessionId;

  ws.on("message", async (message) => {
    console.log("📩 Mensaje recibido:", message);

    try {
      const data = JSON.parse(message);

      // Inicializar una sesión
      if (data.type === "init") {
        currentSessionId = data.sessionId;
        console.log("🆔 sessionId recibido:", currentSessionId);

        const apiUrl = `http://localhost:8000/ssh-session/${currentSessionId}`;
        console.log("🌐 Solicitando datos a Laravel en:", apiUrl);

        let session;
        try {
          const response = await axios.get(apiUrl);
          session = response.data;
          console.log("✅ Datos de sesión obtenidos:", session);
        } catch (err) {
          console.error("❌ Error al obtener sesión de Laravel:", err.message);
          ws.send(JSON.stringify({ output: `❌ Error al obtener sesión: ${err.message}` }));
          return;
        }

        // Crear o reutilizar terminal
        const terminal = createSSHProcess(currentSessionId, session, ws);
        terminal.onData((data) => {
          ws.send(JSON.stringify({ output: data }));
        });

        terminal.onExit(() => {
          console.log(`❌ Terminal cerrada para sesión ${currentSessionId}`);
        });

        // Registrar el socket en la sesión
        getSession(currentSessionId).sockets.add(ws);
        console.log(`📡 WebSocket añadido a sesión ${currentSessionId}`);
      }

      // Entrada del usuario
      if (data.input && currentSessionId) {
        const session = getSession(currentSessionId);
        if (session && session.pty) {
          console.log("⌨️ Entrada del usuario:", data.input.trim());
          session.pty.write(data.input);
        }
      }

      // Cambio de tamaño del terminal
      if (data.type === "resize" && currentSessionId) {
        console.log("📐 Resize recibido:", data.cols, "x", data.rows);
        resizeSession(currentSessionId, data.cols, data.rows);
      }
    } catch (err) {
      console.error("❌ Error procesando mensaje:", err.message);
      ws.send(JSON.stringify({ output: `❌ Error: ${err.message}` }));
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket desconectado");

    if (currentSessionId) {
      cleanupSocket(currentSessionId, ws);
    }
  });
});
