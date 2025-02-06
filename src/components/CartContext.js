import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [produtos, setProdutos] = useState(() => {
    const savedCart = localStorage.getItem("produtos");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? parseFloat(savedTotal) : 0;
  });

  const calcularTotal = (produtos) => {
    const novoTotal = produtos.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    setTotal(novoTotal);
    localStorage.setItem("total", novoTotal); // Salva o total no localStorage
  };

  useEffect(() => {
    calcularTotal(produtos); // Calcula o total ao montar o componente
  }, [produtos]);

  const adicionarAoCarrinho = (produto) => {
    setProdutos((carrinhoAtual) => {
      const produtoExistente = carrinhoAtual.find((item) => item.id === produto.id);

      let novoCarrinho;
      if (produtoExistente) {
        novoCarrinho = carrinhoAtual.map((item) =>
          item.id === produto.id ? { ...item, quantidade: Math.min(item.quantidade + 1, produto.estoque) } : item
        );
      } else {
        novoCarrinho = [...carrinhoAtual, { ...produto, quantidade: 1 }];
      }

      calcularTotal(novoCarrinho);
      localStorage.setItem("produtos", JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const removerDoCarrinho = (id) => {
    setProdutos((carrinhoAtual) => {
      const novoCarrinho = carrinhoAtual.filter((item) => item.id !== id);
      calcularTotal(novoCarrinho);
      localStorage.setItem("produtos", JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const atualizarQuantidade = (id, quantidade) => {
    setProdutos((carrinhoAtual) => {
      const novoCarrinho = carrinhoAtual.map((item) =>
        item.id === id ? { ...item, quantidade: Math.min(quantidade, item.estoque) } : item
      );
      calcularTotal(novoCarrinho);
      localStorage.setItem("produtos", JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const clearCart = () => {
    setProdutos([]);
    setTotal(0);
    localStorage.removeItem("produtos");
    localStorage.removeItem("total");
  };

  return (
    <CartContext.Provider
      value={{
        produtos,
        total,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
