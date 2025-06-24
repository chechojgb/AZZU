import { useState, useEffect, useRef } from "react";
import useSSHConsole from "@/hooks/useSSHConsole";
import useCommandHistory from "@/hooks/useCommandHistory";

export default function SimpleSSHTerminal() {
  const [command, setCommand] = useState("");
  const [lastTabTime, setLastTabTime] = useState(0);
  const [isAwaitingAutocomplete, setIsAwaitingAutocomplete] = useState(false);
  const history = useCommandHistory();
  const outputRef = useRef(null);
  const wasAtBottom = useRef(true);

  const handleAutoComplete = (completed) => {
    setCommand(completed);
  };

  const {
    connected,
    status,
    user,
    host,
    cwd,
    output,
    sendCommand,
    triggerAutocomplete,
    triggerSuggestion,
  } = useSSHConsole({ onAutocomplete: handleAutoComplete });

  const checkIfAtBottom = () => {
    const el = outputRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 10;
  };

  useEffect(() => {
    const el = outputRef.current;
    if (el && wasAtBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [output]);

  const handleSend = () => {
    if (!command.trim()) return;
    sendCommand(command);
    history.addCommand(command);
    setCommand("");
  };

  const handleTab = () => {
    const now = Date.now();
    const since = now - lastTabTime;

    if (since < 300) {
      triggerSuggestion(command);
    } else {
      setIsAwaitingAutocomplete(true);
      triggerAutocomplete(command);
    }
    setLastTabTime(now);
  };

  return (
    <div className="h-screen flex flex-col text-green-300 p-4">
      <h2 className="text-xl font-semibold mb-4">Terminal SSH</h2>

      <div className="text-sm mb-2">
        Estado: {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </div>
      {status && <div className="text-xs mb-2">{status}</div>}

      <div
        ref={outputRef}
        onScroll={() => {
          if (outputRef.current) {
            wasAtBottom.current = checkIfAtBottom();
          }
        }}
        className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm mb-2 border rounded p-2 font-mono scroll-smooth"
      >
        {output.split("\n").map((line, idx) => {
          let color = "text-green-300";

          if (/❌/.test(line) || /not found|denied|error/i.test(line)) {
            color = "text-red-400";
          } else if (/^warning/i.test(line)) {
            color = "text-yellow-400";
          } else if (/^\.{0,2}\//.test(line) || /\/$/.test(line)) {
            color = "text-blue-300";
          } else if (/\.(txt|log|json|sh|js|php|py|md)$/i.test(line)) {
            color = "text-purple-300";
          }

          return (
            <div key={idx} className={color}>
              {line}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-400 whitespace-nowrap">
          {user && host && cwd ? `${user}@${host}:${cwd} $` : "$"}
        </span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-green-300"
          placeholder="Escribe un comando..."
          value={command}
          onChange={(e) => {
            setCommand(e.target.value);
            history.resetPointer();
            // lastAutoCompleteBase.current = ""; // importante para reactivar autocompletado
            console.log("✏️ Usuario está escribiendo, reseteando base");
            }} 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCommand(history.goBack());
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setCommand(history.goForward());
            } else if (e.key === "Tab") {
              e.preventDefault();
              handleTab();
            }
          }}
        />
        <button
          className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800 transition"
          onClick={handleSend}
        >
          Ejecutar
        </button>
      </div>
    </div>
  );
}
