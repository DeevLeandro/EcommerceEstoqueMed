// PesquisaContext.js
import React, { createContext, useContext, useState } from "react";

const PesquisaContext = createContext();

export const PesquisaProvider = ({ children }) => {
   const [searchTerm, setSearchTerm] = useState("");

   return (
      <PesquisaContext.Provider value={{ searchTerm, setSearchTerm }}>
         {children}
      </PesquisaContext.Provider>
   );
};

export const usePesquisa = () => useContext(PesquisaContext);
