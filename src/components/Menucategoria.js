import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function MenuCategoria({ setCategoriaSelecionada }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/PesquisaGrupoProduto",
      headers: {
        "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
        "Content-Type": "application/json",
      },
      params: {
        Token: "7QDLJV9OHHIJBHYGJM8Y",
        Grupo: "343",
        Empresa: "682",
      },
    };

    axios
      .request(config)
      .then((response) => {
        const descricoes = response.data.map((item) => item.Descricao || "Sem descrição");
        setCategorias(descricoes);
      })
      .catch((error) => console.error("Erro ao buscar categorias:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);

    // Realizar a chamada para buscar todos os produtos relacionados à categoria
    const configProdutos = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/PesqProduto",
      headers: {
        "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
        "Content-Type": "application/json",
      },
      params: {
        Token: "7QDLJV9OHHIJBHYGJM8Y",
        Grupo: "343",
        Empresa: "682",
        TipoPesquisa: "G", // Use "C" para pesquisa por categoria
        Campo: "GrupoProduto",
        Valor: categoria, // Valor da categoria selecionada
        limite: "",
        Paginacao: "10",
      },
    };

    axios
      .request(configProdutos)
      .then((response) => {
        console.log("Produtos da categoria:", response.data);
        // Atualize o estado global de produtos (ou qualquer estado relacionado ao contexto)
      })
      .catch((error) => console.error("Erro ao buscar produtos da categoria:", error));
  };

  if (location.pathname !== "/Produto") {
    return null; // Não renderiza o menu fora da rota "/Produto"
  }

  return (
    <div className="menu-categoria">
      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <ul>
          {categorias.map((descricao, index) => (
            <li key={index} onClick={() => handleCategoriaClick(descricao)}>
              {descricao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
