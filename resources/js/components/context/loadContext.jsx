import { createContext, useContext, useState } from "react";

const LoadContext = createContext();

export const LoadProvider = ({ total = 5, children }) => {
  const [loaded, setLoaded] = useState(0);

  const markLoaded = () => setLoaded(prev => prev + 1);
  const allLoaded = loaded >= total;

  return (
    <LoadContext.Provider value={{ allLoaded, markLoaded }}>
      {children}
    </LoadContext.Provider>
  );
};

export const useLoadStatus = () => useContext(LoadContext);
