// ✅ React Terminal - Comando junto al prompt
import { useState, useEffect, useRef } from "react";
import useSSHConsole from "@/hooks/useSSHConsole";
import useCommandHistory from "@/hooks/useCommandHistory";

export default function SimpleSSHTerminal() {
  const [command, setCommand] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastTabPressed, setLastTabPressed] = useState(0);

  const history = useCommandHistory();
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const wasAtBottom = useRef(true);
  const lastCommandRendered = useRef("");

  const {
    connected,
    status,
    user,
    host,
    cwd,
    output,
    sendCommand,
    triggerSuggestion,
  } = useSSHConsole({
    onSuggestion: (list) => {
      setSuggestions(list);
      setSelectedIndex(0);
      setShowSuggestions(true);
    },
  });

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

    if (suggestions.length > 0 && selectedIndex >= 0) {
      applySuggestion(suggestions[selectedIndex]);
      return;
    }

    lastCommandRendered.current = command;
    sendCommand(command);
    history.addCommand(command);
    setCommand("");
    setSuggestions([]);
    setSelectedIndex(-1);
    setShowSuggestions(false);
  };

  const handleTab = () => {
    const now = Date.now();
    if (now - lastTabPressed < 300) {
      setShowSuggestions(true);
    } else {
      triggerSuggestion(command);
    }
    setLastTabPressed(now);
  };

  const applySuggestion = (suggestion) => {
    const parts = command.trim().split(/\s+/);
    parts[parts.length - 1] = suggestion;
    setCommand(parts.join(" ") + " ");
    setSuggestions([]);
    setSelectedIndex(-1);
    setShowSuggestions(false);
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

          // const isPrompt = /^\w+@[\w.-]+:.*\$ ?$/.test(line.trim());
          // if (isPrompt && lastCommandRendered.current) {
          //   line = `${line.trim()} ${lastCommandRendered.current}`;
          //   lastCommandRendered.current = "";
          // }

          return (
            <div key={idx} className={color}>
              {line}
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400 whitespace-nowrap">
            {user && host && cwd ? `${user}@${host}:${cwd} $` : "$"}
          </span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-green-300"
            placeholder="Escribe un comando..."
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              history.resetPointer();
              setSuggestions([]);
              setSelectedIndex(-1);
            }}
            onKeyDown={(e) => {
              if (suggestions.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev + 1) % suggestions.length);
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex(
                    (prev) => (prev - 1 + suggestions.length) % suggestions.length
                  );
                  return;
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    applySuggestion(suggestions[selectedIndex]);
                  } else {
                    handleSend();
                  }
                  return;
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setSuggestions([]);
                  setSelectedIndex(-1);
                  return;
                }
              }

              if (e.key === "Tab") {
                e.preventDefault();
                handleTab();
              } else if (e.key === "Enter") {
                handleSend();
              } else if (e.key === "Backspace") {
                if (command.trim() === "") {
                  setSuggestions([]);
                  setSelectedIndex(-1);
                }
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCommand(history.goBack());
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setCommand(history.goForward());
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

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-36 bottom-10 mb-1 w-[calc(100%-144px)] bg-black border border-green-700 rounded shadow-md z-10 max-h-40 overflow-y-auto text-sm">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className={`px-3 py-1 cursor-pointer ${
                  selectedIndex === idx
                    ? "bg-green-700 text-white"
                    : "hover:bg-green-800"
                }`}
                onMouseDown={() => applySuggestion(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
