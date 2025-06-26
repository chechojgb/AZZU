// components/XTermSSH.jsx
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTermSSH() {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(new FitAddon());
  const socketRef = useRef(null);

  useEffect(() => {
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: {
        background: "#1e1e1e",
        foreground: "#00ff00",
      },
    });

    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Conexión WebSocket
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onopen = () => {
      term.current.write("🟢 Conectado al servidor\n");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.output) {
        term.current.write(data.output);
      } else if (typeof event.data === "string") {
        term.current.write(event.data);
      }
    };

    socketRef.current.onclose = () => {
      term.current.write("\n🔌 Conexión cerrada");
    };

    socketRef.current.onerror = (err) => {
      term.current.write(`\n❌ Error: ${err.message}`);
    };

    // Captura de entrada del usuario
    term.current.onData((data) => {
      socketRef.current.send(JSON.stringify({ input: data }));
    });

    // Resize terminal si la ventana cambia de tamaño
    const handleResize = () => fitAddon.current.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      term.current.dispose();
      socketRef.current.close();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-screen bg-black">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
}
