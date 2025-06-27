require("dotenv").config();
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { Client } = require("ssh2");

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("📡 Cliente conectado");

  const ssh = new Client();
  let shellStream;

  ssh
    .on("ready", () => {
      console.log("🔐 Conexión SSH establecida");
      ssh.shell({ 
        term: 'xterm-color',
        rows: 40,
        cols: 120,
        pty: true
      }, (err, stream) => {
        if (err) {
          ws.send(JSON.stringify({ output: `Error iniciando shell: ${err.message}\n` }));
          return;
        }

        shellStream = stream;
        // ws.send(JSON.stringify({ output: "🟢 Sesión iniciada\n" }));

        stream.on("data", (data) => {
          ws.send(JSON.stringify({ output: data.toString() }));
        });

        stream.stderr.on("data", (data) => {
          ws.send(JSON.stringify({ output: data.toString() }));
        });

        stream.on("close", () => {
          console.log("🔒 Shell cerrada");
          ssh.end();
        });
      });
    })
    .on("error", (err) => {
      console.error("❌ Error SSH:", err.message);
      ws.send(JSON.stringify({ output: "Fallo SSH: " + err.message }));
    })
    .connect({
      host: "192.168.20.58",
      port: 22,
      username: "chechojgb",
      password: "3209925728",
    });

  // ✅ Captura de entrada cruda desde xterm
  ws.on("message", (msg) => {
    let input;
    try {
      const parsed = JSON.parse(msg);
      input = parsed.input;
    } catch (err) {
      input = msg.toString();
    }

    if (shellStream && input) {
      shellStream.write(input);
    }
  });

  ws.on("close", () => {
    console.log("🔌 Cliente desconectado");
    if (shellStream) shellStream.end();
    ssh.end();
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
