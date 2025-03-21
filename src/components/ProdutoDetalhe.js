import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMoneyBill, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTipoCliente } from "./PrecoContext";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const { adicionarAoCarrinho } = useCart();
  const navigate = useNavigate();
  const [produtoDetalhado, setProdutoDetalhado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);  // Inicia sempre no índice 0, que será a primeira imagem
  const { TipoCliente } = useTipoCliente();
  // Definindo imagens para o hover
  const image1 = "URL_PARA_IMAGEM_PADRAO_1";  // Imagem original
  const image2 = "URL_PARA_IMAGEM_HOVER";    // Imagem para o hover

  useEffect(() => {
    setLoading(true);

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/PesquisaProdutoSimples",
      headers: {
        "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
        "Content-Type": "application/json",
      },
      params: {
        Token: "7QDLJV9OHHIJBHYGJM8Y",
        Grupo: "343",
        Empresa: "682",
        IDProduto: id,
      },
    };

    axios(config)
      .then((response) => {
        const produtoEncontrado = response.data?.[0];
        if (produtoEncontrado) {
          setProdutoDetalhado({
            ...produtoEncontrado,
            PrecoAtacado: produtoEncontrado.Atacado ? parseFloat(produtoEncontrado.Atacado.replace(",", ".")) : 0,
            PrecoVarejo: produtoEncontrado.Varejo ? parseFloat(produtoEncontrado.Varejo.replace(",", ".")) : 0,
            Estoque: produtoEncontrado.Qtde ? produtoEncontrado.Qtde : "N/D", // Corrigido para "Qtde" e default "N/D"
            Fotos: produtoEncontrado.Fotos || [],
          });
          setErro(null);
        } else {
          setErro("Produto não encontrado.");
        }
      })
      .catch((error) => {
        // console.error("Erro ao buscar produto:", error);
        setErro("Erro ao carregar produto. Tente novamente mais tarde.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;
  if (!produtoDetalhado) return <p>Produto não encontrado.</p>;

  const { Produto: nome, PrecoAtacado: precoAtacado, PrecoVarejo: precoVarejo, Estoque: estoque, Marca: marca, DescricaoWeb: descricao, Fotos } = produtoDetalhado;

  const handleAddToCart = () => {
    if (estoque === "N/D" || estoque <= 0) {
      alert("Produto fora de estoque!");
      return;
    }

    adicionarAoCarrinho({
      id,
      nome,
      preco: TipoCliente === "0" ? precoAtacado : precoVarejo,
      image: Fotos[sliderIndex]?.Caminho || image1,  // Sempre pegar a imagem do índice atual
      estoque,
    });
  };

  const handleComprarAgora = () => {
    handleAddToCart();
    navigate("/pagamento");
  };

  const handleNextImage = () => {
    setSliderIndex((prevIndex) => (prevIndex + 1) % Fotos.length); // Avançar imagem
  };

  const handlePrevImage = () => {
    setSliderIndex((prevIndex) => (prevIndex - 1 + Fotos.length) % Fotos.length); // Voltar imagem
  };

  return (
    <div className="produto-detalhe">
      <div className="produto-imagens">
        {Fotos.length > 1 && (
          <div className="imagem-slider">
            <button className="btn-prev" onClick={handlePrevImage}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <img
              src={Fotos[sliderIndex]?.Caminho || image1}  // Se não houver fotos, use a imagem padrão
              alt={nome}
              className="produto-imagem-principal"
            />
            <button className="btn-next" onClick={handleNextImage}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
      <div className="produto-info">
        <h1>{nome}</h1>
        <div className="descricao" dangerouslySetInnerHTML={{ __html: descricao }} />
        <p className="marca">Marca: {marca}</p>
        <p className="estoque">Quantidade: {estoque}</p>
        <p className="price">
        <span>R$</span>{(TipoCliente === "0" ? precoAtacado : precoVarejo).toFixed(2)}
      </p>
        <div className="btn-produto">
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
    </div>
  );
}
