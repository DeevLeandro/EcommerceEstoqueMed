import React, { createContext, useContext, useState } from "react";

const CartaoContext = createContext();

export function CartaoProvider({ children }) {
  const [cartoes, setCartoes] = useState([]);

  const adicionarCartao = (cartao) => {
    setCartoes((prev) => [...prev, cartao]);
  };

  const removerCartao = (id) => {
    setCartoes((prev) => prev.filter((cartao) => cartao.id !== id));
  };

  return (
    <CartaoContext.Provider value={{ cartoes, adicionarCartao, removerCartao }}>
      {children}
    </CartaoContext.Provider>
  );
}

export function useCartao() {
  return useContext(CartaoContext);
}
