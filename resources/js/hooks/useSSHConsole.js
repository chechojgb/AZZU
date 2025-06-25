import { useEffect, useRef, useState } from "react";

export default function useSSHConsole({ onSuggestion } = {}) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [cwd, setCwd] = useState("");
  const [output, setOutput] = useState("");

  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  const lastSentCommand = useRef("");
  const awaitingSuggestion = useRef(false);
  const lastSuggestionCommand = useRef("");

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

      if (msg.suggestions) {
        awaitingSuggestion.current = false;
        lastSuggestionCommand.current = "";

        const clean = (s) =>
          s
            .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "")
            .replace(/\r/g, "")
            .trim();

        const list = msg.suggestions
          .map(clean)
          .filter(
            (s) =>
              s &&
              !s.startsWith("\x1B") &&
              !s.includes("__AUTO") &&
              !s.includes("_END") &&
              !s.match(/^.*@.*:.*\$/)
          );

        console.log("💡 Sugerencias:", list);
        if (onSuggestion) onSuggestion(list);
        return;
      }

      if (msg.output) {
        const clean = (text) =>
          text
            .replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "")
            .replace(/\r/g, "")
            .trim();

        const text = clean(msg.output);
        setOutput((prev) => prev + "\n" + text);
      }

      if (msg.error) {
        setOutput((prev) => prev + "\n❌ " + msg.error);
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

  const sendCommand = (cmd) => {
    if (!cmd || socketRef.current?.readyState !== WebSocket.OPEN) return;
    lastSentCommand.current = cmd;
    socketRef.current.send(JSON.stringify({ command: cmd }));
  };

  const triggerSuggestion = (cmd) => {
    const cleanCmd = cmd.trim();
    if (
      !cleanCmd ||
      awaitingSuggestion.current ||
      cleanCmd === lastSuggestionCommand.current
    ) {
      console.log("⛔ Ignorando trigger repetido o esperando");
      return;
    }

    lastSuggestionCommand.current = cleanCmd;
    awaitingSuggestion.current = true;

    const autoCmd = `__AUTO_SUGGEST__ ${cmd}`;
    console.log("📤 Enviando sugerencias para:", cleanCmd);
    socketRef.current.send(JSON.stringify({ command: autoCmd }));
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
    triggerSuggestion,
  };
}
