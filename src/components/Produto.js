import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMoneyBill, faStar } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTipoCliente } from "./PrecoContext";

export default function Produto({ id, nome, preco, preco2, estoque, marca, image1, image2, categorias, promocao }) {
  const { adicionarAoCarrinho } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const precoAtacado = preco ? parseFloat(preco.replace(",", ".")) : 0;
  const precoVarejo = preco2 ? parseFloat(preco2.replace(",", ".")) : 0;
  const { TipoCliente } = useTipoCliente();
  const [rating, setRating] = useState(0);


  // Verifica se há promoção e calcula o novo preço
  const desconto = promocao ? parseFloat(promocao) : 0;
  const precoBase = TipoCliente === "0" ? precoAtacado : precoVarejo;
  const precoComDesconto = promocao ? precoBase - (precoBase * (desconto / 100)) : precoBase;

  const handleAddToCart = () => {
    if (estoque <= 0) {
      alert("Produto fora de estoque!");
      return;
    }

    adicionarAoCarrinho({
      id,
      nome,
      preco: TipoCliente === "0" ? precoAtacado : precoVarejo, precoComDesconto,
      image: image1,
      estoque,
    });
  };

  const handleComprarAgora = () => {
    handleAddToCart();
    navigate("/pagamento");
  };

  const handleViewDetails = () => {
    navigate(`/detalhe-produto/${id}`);
  };

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const isListaProdutos = location.pathname === "/produtos";

  return (
    <div className="Lista">
      <div className="image-container">
        <img
          src={image1}
          alt={nome}
          onMouseEnter={(e) => { e.currentTarget.src = image2; }}
          onMouseLeave={(e) => { e.currentTarget.src = image1; }}
          className="fade-in"
          onClick={handleViewDetails}
        />
        {promocao && <span className="promocao">-{promocao}% OFF</span>}
      </div>
      <p className="name">{nome}</p>
      <p className="id">{id}</p>
      <p className="marca">{marca}</p>
      <div className="rate">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={`star ${rating > index ? "filled" : ""}`}
            onClick={() => handleRating(index)}
          />
        ))}
      </div>
      <p className="estoque"> Quantidade: {estoque}</p>
      <p className="price">
        <span>R$</span>{(TipoCliente === "0" ? precoAtacado : precoVarejo).toFixed(2)}
      </p>
      <p className="promocao">
      {promocao ? (
          <>
            <span className="old-price">R${precoBase.toFixed(2)}</span>
            <span className="new-price"> R${precoComDesconto.toFixed(2)}</span>
          </>
        ) : (
          <span>{''}</span>
        )}
      </p>
      <div className="btnPrduto">
        <button className="btn-icon add-to-cart-btn" onClick={handleAddToCart}>
          <span>Adicionar ao Carrinho</span>
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
        <button className="btn-icon" onClick={handleComprarAgora}>
          <span>Comprar Agora</span>
          <FontAwesomeIcon icon={faMoneyBill} />
        </button>
      </div>
    </div>
  );
}
