import { createContext, useContext, useState } from "react";

const PagamentoContext = createContext();

export function PagamentoProvider({ children }) {
  const [codigoPagamento, setCodigoPagamento] = useState(null);

  return (
    <PagamentoContext.Provider value={{ codigoPagamento, setCodigoPagamento }}>
      {children}
    </PagamentoContext.Provider>
  );
}

export function usePagamento() {
  return useContext(PagamentoContext);
}