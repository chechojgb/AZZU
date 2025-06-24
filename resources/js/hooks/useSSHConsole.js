import { useEffect, useRef, useState } from "react";

export default function useSSHConsole({ onAutocomplete, onSuggestion } = {}) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [cwd, setCwd] = useState("");
  const [output, setOutput] = useState("");

  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  const awaitingAutocomplete = useRef(false);
  const lastSentCommand = useRef("");
  const autoCompleteCallbackRef = useRef(null);
  const lastAutoCompleteBase = useRef("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
      setConnected(true);
      setStatus("🟢 Consola lista para conectar");
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket cerrado");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("❌ Error WebSocket:", err);
    };

    socket.onmessage = (event) => {
      let msg = {};
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        console.warn("⚠️ No se pudo parsear JSON:", event.data);
        return;
      }

      if (msg.status) setStatus(msg.status);
      if (msg.user) setUser(msg.user);
      if (msg.host) setHost(msg.host);
      if (msg.cwd) setCwd(msg.cwd);

      // ✅ Autocompletado exacto
      if (msg.autocomplete) {
        const cleanValue = clean(msg.autocomplete);
        const forbidden = ["compgen", "echo", "_END", "__AUTO", "$"];
        const isInvalid = forbidden.some((term) => cleanValue.includes(term));

        if (!isInvalid && cleanValue.trim() !== "") {
          console.log("✅ Autocompletado válido recibido:", cleanValue);
          if (cleanValue === lastAutoCompleteBase.current) {
            console.warn("🔁 Autocompletado repetido");
            return;
          }

          lastAutoCompleteBase.current = cleanValue;

          const original = lastSentCommand.current.trim();
          const parts = original.split(/\s+/);
          parts[parts.length - 1] = cleanValue;
          const completed = parts.join(" ");

          if (onAutocomplete) {
            onAutocomplete(completed);
          } else if (autoCompleteCallbackRef.current) {
            autoCompleteCallbackRef.current(completed);
            autoCompleteCallbackRef.current = null;
          }

          awaitingAutocomplete.current = false;
          return;
        } else {
          console.warn("⛔ Autocompletado inválido, intentamos con sugerencias si hay");
        }
      }

      // ✅ Sugerencias múltiples
      if (msg.suggestions) {
        const list = msg.suggestions
          .map((s) => clean(s))
          .filter((s) => s && !s.startsWith("\x1B") && !s.includes("__AUTO"));

        console.log("💡 Sugerencias:", list);

        if (list.length === 1 && awaitingAutocomplete.current) {
          const original = lastSentCommand.current.trim();
          const parts = original.split(/\s+/);
          parts[parts.length - 1] = list[0];
          const completed = parts.join(" ");

          if (onAutocomplete) {
            onAutocomplete(completed);
          }
        } else if (onSuggestion) {
          onSuggestion(list);
        }

        awaitingAutocomplete.current = false;
        return;
      }

      if (msg.output) {
        const text = clean(msg.output);
        setOutput((prev) => prev + "\n" + text);
      }

      if (msg.error) {
        setOutput((prev) => prev + "\n❌ " + clean(msg.error));
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const clean = (text) =>
    text
      .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "")
      .replace(/\r/g, "")
      .trim();

  const sendCommand = (cmd) => {
    if (!cmd || socketRef.current?.readyState !== WebSocket.OPEN) return;
    lastSentCommand.current = cmd;
    socketRef.current.send(JSON.stringify({ command: cmd }));
  };

  const triggerAutocomplete = (cmd, callback) => {
    const tokens = cmd.trim().split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (last.length < 1 || last === lastAutoCompleteBase.current) {
      console.log("⛔ Evitando autocompletar repetido o vacío");
      return;
    }

    awaitingAutocomplete.current = true;
    lastSentCommand.current = cmd;
    lastAutoCompleteBase.current = last;
    autoCompleteCallbackRef.current = callback;

    const autoCmd = `__AUTO_COMPLETE__ ${cmd}`;
    console.log("📤 Enviando autocompletado:", autoCmd);
    socketRef.current.send(JSON.stringify({ command: autoCmd }));
  };

  const triggerSuggestion = (cmd) => {
    if (!socketRef.current) return;
    socketRef.current.send(JSON.stringify({ command: `__AUTO_SUGGEST__ ${cmd}` }));
  };

  return {
    connected,
    status,
    user,
    host,
    cwd,
    output,
    scrollRef,
    sendCommand,
    triggerAutocomplete,
    triggerSuggestion,
  };
}
