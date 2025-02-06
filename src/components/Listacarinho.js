import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./CartContext";
import Carinhoproduto from "./Carinhoproduto";
import { useNavigate } from "react-router-dom";

export default function Listacarinho() {
  const { produtos, total, removerDoCarrinho } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Função para fechar o carrinho
  const fecharCarrinho = () => setIsVisible(false);

  const handleFinalizarCompra = () => {
    const produtosComEstoqueInsuficiente = produtos.filter(
      (produto) => produto.quantidade > produto.estoque
    );

    if (produtosComEstoqueInsuficiente.length > 0) {
      alert("Um ou mais produtos no carrinho estão indisponíveis.");
      return;
    }

    fecharCarrinho(); // Fecha o carrinho
    navigate("/pagamento"); // Navega para a página de pagamento
  };

  return (
    isVisible && (
      <aside className="sidebar-cart">
        <div className="top">
          <h3>Seu Carrinho</h3>
          <button onClick={fecharCarrinho} className="close-cart-btn">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="lista-produto-carinho">
          {produtos.length > 0 ? (
            produtos.map((produto, index) => (
              <Carinhoproduto
                key={index}
                produto={produto}
                onRemove={() => removerDoCarrinho(produto.id)}
              />
            ))
          ) : (
            <i>Seu Carrinho está vazio</i>
          )}
        </div>
        {produtos.length > 0 && (
          <>
            <div className="total-container">
              <b>Total:</b> R$ {total.toFixed(2)}
            </div>
            <button className="btn-icon1" onClick={handleFinalizarCompra}>
              <span>Pagar Agora</span>
              <FontAwesomeIcon icon={faMoneyBill} />
            </button>
          </>
        )}
      </aside>
    )
  );
}
