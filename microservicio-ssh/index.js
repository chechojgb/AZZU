// ✅ Backend index.js actualizado (autocompletado y sugerencias con logs extendidos)

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
  ws.send(JSON.stringify({ status: "🟢 Consola lista para conectar" }));

  const ssh = new Client();
  let shellStream;
  let contextBuffer = "";
  let collectingContext = false;

  const cleanContextPart = (text) => {
    return text
      .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.includes("__CTX") && !line.includes("$"))
      .join("")
      .trim();
  };

  ssh
    .on("ready", () => {
      console.log("🔐 Conexión SSH establecida");
      ssh.shell((err, stream) => {
        if (err) {
          ws.send(JSON.stringify({ error: "Error iniciando shell: " + err.message }));
          return;
        }

        shellStream = stream;
        stream.write(
          "echo __CTX_START__ && whoami && echo __CTX__ && hostname && echo __CTX__ && pwd && echo __CTX_END__\n"
        );

        stream.on("data", (data) => {
          const text = data.toString();
          console.log("📥 SSH DATA:", JSON.stringify(text));

          if (text.includes("__AUTO_MARK_") && text.includes("__END")) {
              const matched = text.match(/__AUTO_MARK_(\d+)__/);
              const id = matched?.[1];
              if (!id) return;

              const [_, raw] = text.split(`__AUTO_MARK_${id}__`);
              const [content] = raw.split(`__AUTO_MARK_${id}___END`);

              const rawLines = content.split("\n").map((l) => l.trim());

              const cleanLine = (line) =>
                line
                  .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "") // ANSI codes
                  .replace(/\x1B\][^\x07]*\x07/g, "")     // OSC sequences
                  .replace(/^\s*[\x00-\x1F\x7F-\x9F]+/, "") // Control chars
                  .trim();

              const lines = rawLines
                .map(cleanLine)
                .filter(
                  (l) =>
                    l &&
                    !l.includes("__AUTO") &&
                    !l.includes("_END") &&
                    !/^\w+@[\w.-]+:.*\$/.test(l) &&
                    !l.startsWith("echo") &&
                    !l.includes("compgen") &&
                    !l.startsWith("bash:") &&
                    !/^\x1B/.test(l)
                );

              const unique = [...new Set(lines)];

              console.log("🔍 Sugerencias/autocompletado recibidas:", unique);

              if (unique.length > 0) {
                ws.send(JSON.stringify({ suggestions: unique }));
                // También opcionalmente las imprimes en la terminal
                // shellStream.write("echo " + unique.join("  ") + "\n");
              } else {
                ws.send(JSON.stringify({ suggestions: [] }));
              }
              return;
          }

          if (text.includes("__CTX_START__")) {
            collectingContext = true;
            contextBuffer = "";
            return;
          }

          if (text.includes("__CTX_END__")) {
            collectingContext = false;
            contextBuffer += text;
            const parts = contextBuffer.split("__CTX__");
            const context = {
              user: cleanContextPart(parts[0] || ""),
              host: cleanContextPart(parts[1] || ""),
              cwd: cleanContextPart(parts[2] || ""),
            };
            ws.send(JSON.stringify(context));
            return;
          }

          if (collectingContext) {
            contextBuffer += text;
            return;
          }

          if (
            !text.includes("__AUTO_MARK_") &&
            !/^echo\s+[^\n]+$/m.test(text.trim()) // evita imprimir líneas como echo AST_API
          ) {
            ws.send(JSON.stringify({ output: text }));
          }
        });

        stream.stderr.on("data", (data) => {
          console.error("❌ STDERR:", data.toString());
          ws.send(JSON.stringify({ error: data.toString() }));
        });

        stream.on("close", () => {
          console.log("🔒 Shell cerrada");
          ssh.end();
        });
      });
    })
    .on("error", (err) => {
      console.error("❌ Error SSH:", err.message);
      ws.send(JSON.stringify({ error: "Fallo SSH: " + err.message }));
    })
    .connect({
      host: "192.168.20.58",
      port: 22,
      username: "chechojgb",
      password: "3209925728",
    });

  ws.on("message", (msg) => {
    let command;
    try {
      const parsed = JSON.parse(msg);
      command = parsed.command?.trim();
    } catch {
      command = msg.toString().trim();
    }

    if (!shellStream || !command) return;

    const isInternal = command.startsWith("__AUTO_COMPLETE__") || command.startsWith("__AUTO_SUGGEST__");

    if (isInternal) {
      const parts = command.replace(/__AUTO_(COMPLETE|SUGGEST)__/, "").trim().split(/\s+/);
      const lastWord = parts[parts.length - 1] || "";
      const baseCommand = parts[0];
      const autoId = Date.now();

      let flags = "-d -f";
      if (baseCommand === "cd") flags = "-d";
      if (["cat", "nano", "less"].includes(baseCommand)) flags = "-f";

      const wrapped = `echo __AUTO_MARK_${autoId}__ && compgen ${flags} \"${lastWord}\" && echo __AUTO_MARK_${autoId}___END`;

      console.log(`📤 Ejecutando ${command.startsWith("__AUTO_COMPLETE__") ? "autocompletado" : "sugerencias"} con:`, wrapped);

      shellStream.write(`${wrapped}\n`);
      return;
    }

    shellStream.write(`${command}\n`);
    shellStream.write("echo __CTX_START__ && whoami && echo __CTX__ && hostname && echo __CTX__ && pwd && echo __CTX_END__\n");
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