import { useState } from "react";

export default function useSSHContext() {
  const [user, setUser] = useState("");
  const [host, setHost] = useState("");
  const [cwd, setCwd] = useState("");

  const sanitize = (str) =>
    str?.replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, "")
        .replace(/[^\x20-\x7E@._/-]/g, "")
        .trim();

  const updateContext = (data) => {
    if ('user' in data && data.user !== undefined) {
      setUser(sanitize(data.user));
    }

    if ('host' in data && data.host !== undefined) {
      setHost(sanitize(data.host));
    }

    if ('cwd' in data && data.cwd !== undefined) {
      setCwd(sanitize(data.cwd));
    }
  };

  return {
    user,
    host,
    cwd,
    updateContext,
  };
}
