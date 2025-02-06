import React, { createContext, useContext, useState } from "react";

const PrecoContext = createContext();

export function useTipoCliente() {
  return useContext(PrecoContext);
}

export function PrecoProvider({ children }) {
  const [TipoCliente, setTipoCliente] = useState("1");

  return (
    <PrecoContext.Provider value={{ TipoCliente, setTipoCliente }}>
      {children}
    </PrecoContext.Provider>
  );
}
