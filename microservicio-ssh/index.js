const WebSocket = require('ws');
const { Client } = require('ssh2');

const wss = new WebSocket.Server({ port: 8080 });
console.log("🚀 Servidor WebSocket corriendo en ws://localhost:8080");

wss.on('connection', function connection(ws) {
  console.log("🟢 Cliente WebSocket conectado");

  let sshClient = null;
  let sshStream = null;

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log("📥 Mensaje recibido del front:", data);

      // 🔌 Conexión SSH
      if (data.type === 'connect') {
        const { host, port, username, password } = data.payload;

        if (!host || !port || !username || !password) {
          console.error("❌ Faltan datos de conexión SSH");
          ws.send("❌ Datos incompletos para conectar al servidor SSH\n");
          ws.close();
          return;
        }

        sshClient = new Client();
        sshClient
          .on('ready', () => {
            console.log("✅ Conexión SSH establecida");

            sshClient.shell((err, stream) => {
              if (err) {
                console.error("❌ Error al iniciar shell SSH:", err);
                ws.send("❌ Error al iniciar shell SSH\n");
                ws.close();
                return;
              }

              sshStream = stream;

              stream
                .on('data', (chunk) => {
                  ws.send(chunk.toString());
                })
                .on('close', () => {
                  console.log("🔌 Shell cerrada");
                  sshClient.end();
                });

              stream.stderr?.on('data', (chunk) => {
                console.error("🛑 STDERR:", chunk.toString());
              });

              ws.send("🟢 Conectado al servidor SSH\n");
            });
          })
          .on('error', (err) => {
            console.error("❌ Error en SSH:", err);
            ws.send(`❌ Error de conexión SSH: ${err.message}\n`);
            ws.close();
          })
          .on('end', () => {
            console.log("🔚 Conexión SSH finalizada");
          });

        sshClient.connect({ host, port, username, password });
      }

      // ⌨️ Entrada del usuario (comando)
      if (data.type === 'input' && sshStream) {
        sshStream.write(data.payload);
      }

      // 📐 Redimensionar ventana
      if (data.type === 'resize') {
        const { cols, rows } = data.payload;
        if (sshStream) {
          sshStream.setWindow(rows, cols, rows * 24, cols * 8);
        }
      }

    } catch (err) {
      console.error("❌ Error procesando mensaje:", err);
      ws.send("❌ Error interno en el backend\n");
    }
  });

  ws.on('close', () => {
    console.log("🔴 Cliente WebSocket desconectado");
    if (sshClient) {
      sshClient.end();
    }
  });

  ws.on('error', (err) => {
    console.error("❌ Error WebSocket:", err);
  });
});
