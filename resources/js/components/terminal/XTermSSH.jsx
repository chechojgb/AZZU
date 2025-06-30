import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTermSSH({ sessionId }) {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(new FitAddon());
  const socketRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const getTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
      background: isDark ? "#000000" : "#ffffff",
      foreground: isDark ? "#00ff00" : "#000000",
      cursor: isDark ? "#00ff00" : "#000000",
      selection: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0,0,0,0.3)",
    };
  };

  const applyTheme = () => {
    if (term.current) {
      const theme = getTheme();
      term.current.options.theme = theme;
      term.current.refresh(0, term.current.rows - 1);
    }
  };

  useEffect(() => {
    // Crear terminal
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: getTheme(),
    });

    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    // WebSocket
    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onopen = () => {
      console.log("🔌 WebSocket abierto. Enviando init con sessionId:", sessionId);
      socketRef.current.send(JSON.stringify({ type: "init", sessionId }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.output) term.current.write(data.output);
    };

    socketRef.current.onerror = (err) => {
      term.current.write(`\n❌ Error: ${err.message}`);
    };

    term.current.onData((data) => {
      socketRef.current.send(JSON.stringify({ input: data }));
    });

    // 🌟 Copiar automáticamente al seleccionar texto
    term.current.onSelectionChange(() => {
      const selected = term.current.getSelection();
      if (selected) {
        navigator.clipboard.writeText(selected)
          .then(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          })
          .catch((err) => {
            console.error("❌ Error copiando al portapapeles:", err);
          });
      }
    });

    // 🌟 Pegar automáticamente al hacer clic derecho
    terminalRef.current.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      try {
        const text = await navigator.clipboard.readText();
        if (text) term.current.paste(text);
      } catch (err) {
        console.error("❌ Error pegando desde el portapapeles:", err);
      }
    });

    // Detectar cambios de tema (claro/oscuro)
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Redimensionar
    const handleResize = () => fitAddon.current.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      term.current.dispose();
      socketRef.current.close();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [sessionId]);

  return (
    <div className="relative w-full h-full">
      <div ref={terminalRef} className="w-full h-full" />
      {showToast && (
        <div className="absolute top-2 right-2 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm animate-fade-in-out z-50">
          Copiado al portapapeles
        </div>
      )}
    </div>
  );
}
