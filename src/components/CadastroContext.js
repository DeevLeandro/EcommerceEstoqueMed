import React, { createContext, useState, useContext, useEffect } from "react";

const CadastroContext = createContext();

export const CadastroProvider = ({ children }) => {
  const [temCadastro, setTemCadastro] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [formasPagamento, setFormasPagamento] = useState(null);

  useEffect(() => {
    localStorage.removeItem("temCadastro");
    localStorage.removeItem("nomeCliente");
  }, []);

  return (
    <CadastroContext.Provider
      value={{
        temCadastro,
        setTemCadastro,
        nomeCliente,
        setNomeCliente,
        formasPagamento,
        setFormasPagamento,
      }}
    >
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error("useCadastro deve ser usado dentro do CadastroProvider");
  }
  return context;
};
