import { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTermSSH() {
  const { props } = usePage();
  const session = props.session;
  const terminalRef = useRef(null);
  const wsRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(null);

  const sendResize = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && term.current && fitAddon.current) {
      fitAddon.current.fit();
      const { cols, rows } = term.current;
      wsRef.current.send(JSON.stringify({
        type: "resize",
        payload: { cols, rows }
      }));
    }
  };

  useEffect(() => {
    if (!session) {
      console.error("❌ Sesión SSH no está definida");
      return;
    }

    term.current = new Terminal({
      cursorBlink: true,
      fontFamily: "Fira Code, monospace",
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: "#00FF00",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      const { cols, rows } = term.current;
      ws.send(JSON.stringify({ type: "connect", payload: { ...session, cols, rows } }));
    };

    ws.onmessage = (event) => {
      term.current.write(event.data);
    };

    ws.onerror = () => {
      term.current.writeln("\r\n🛑 Error en la conexión WebSocket.");
    };

    ws.onclose = () => {
      term.current.writeln("\r\n🔌 Conexión SSH cerrada.");
    };

    term.current.onData((input) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", payload: input }));
      }
    });

    window.addEventListener("resize", sendResize);
    sendResize();

    const observer = new ResizeObserver(() => {
      sendResize();
    });
    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => {
      window.removeEventListener("resize", sendResize);
      observer.disconnect();
      wsRef.current?.close();
      term.current?.dispose();
    };
  }, [session]);

  return (
    <div className="flex-grow w-full min-h-0">
      <div
        ref={terminalRef}
        className="w-full h-full"
        style={{ background: "#000" }}
      ></div>
    </div>
  );
}
