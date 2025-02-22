import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function MenuCategoria({ setCategoriaSelecionada }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false); // Estado para abrir/fechar o menu
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
    setMenuAberto(false); // Fecha o menu ao selecionar uma categoria
  };

  if (location.pathname !== "/Produto") {
    return null; // Não renderiza o menu fora da rota "/Produto"
  }

  return (
    <>
      {/* Botão para abrir o menu */}
      <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
        ☰ Categorias
      </button>

      {/* Menu Lateral */}
      <div className={`menu-categoria ${menuAberto ? "aberto" : ""}`}>
        <button className="fechar-menu" onClick={() => setMenuAberto(false)}>×</button>
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
    </>
  );
}
