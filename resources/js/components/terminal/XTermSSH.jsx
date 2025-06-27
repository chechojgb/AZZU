import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTermSSH() {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(new FitAddon());
  const socketRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const getTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
      background: isDark ? "#" : "#ffffff",
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
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: getTheme(),
    });

    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.output) {
        term.current.write(data.output);
      } else if (typeof event.data === "string") {
        term.current.write(event.data);
      }
    };

    socketRef.current.onerror = (err) => {
      term.current.write(`\n❌ Error: ${err.message}`);
    };

    term.current.onData((data) => {
      socketRef.current.send(JSON.stringify({ input: data }));
    });

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleResize = () => fitAddon.current.fit();
    window.addEventListener("resize", handleResize);

    // ✅ Copiar automáticamente lo seleccionado (una sola vez)
    let lastCopiedSelection = "";
    term.current.onSelectionChange(() => {
      const selection = term.current.getSelection();
      if (selection && selection !== lastCopiedSelection) {
        navigator.clipboard.writeText(selection).then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 1500);
        });
        lastCopiedSelection = selection;
      }
    });

    // ✅ Pegar con clic derecho
    terminalRef.current.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      const text = await navigator.clipboard.readText();
      if (text) term.current.paste(text);
    });

    return () => {
      term.current.dispose();
      socketRef.current.close();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
