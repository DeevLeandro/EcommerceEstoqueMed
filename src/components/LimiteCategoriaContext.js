import { createContext, useState, useContext } from "react";

const LimiteCategoriaContext = createContext();

export function LimiteCategoriaProvider({ children }) {
  const [limitecategoria, setLimitecategoria] = useState("");

  return (
    <LimiteCategoriaContext.Provider value={{ limitecategoria, setLimitecategoria }}>
      {children}
    </LimiteCategoriaContext.Provider>
  );
}

export function useLimiteCategoria() {
  return useContext(LimiteCategoriaContext);
}