import { useState } from "react";

export default function useCommandHistory() {
  const [history, setHistory] = useState([]);
  const [pointer, setPointer] = useState(-1);

  const addCommand = (cmd) => {
    if (!cmd.trim()) return;

    // No lo agregues si es igual al anterior
    if (history[history.length - 1] !== cmd.trim()) {
      setHistory((prev) => [...prev, cmd.trim()]);
    }
    setPointer(-1); // resetea navegación después de enviar
  };

  const goBack = () => {
    if (history.length === 0) return "";
    const newPointer = Math.min(history.length - 1, pointer + 1);
    setPointer(newPointer);
    return history[history.length - 1 - newPointer] || "";
  };

  const goForward = () => {
    if (pointer <= 0) {
      setPointer(-1);
      return "";
    }
    const newPointer = pointer - 1;
    setPointer(newPointer);
    return history[history.length - 1 - newPointer] || "";
  };

  const resetPointer = () => setPointer(-1);

  return {
    addCommand,
    goBack,
    goForward,
    resetPointer,
  };
}
