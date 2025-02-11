import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Header from "../Header";
import ListaProduto from "../Listaproduto";
import Sessaoexclusiva from "../Sessaoexclusiva";
import Listacomentario from "../Listacomentario";
import SobreNos from "../Sobrenos";
import Mapa from "../Mapa";

export default function HomePage({ produto, erro, pagina, handleProximaPagina, handlePaginaAnterior, limite }) {
  return (
    <>
      <Header />
      <div className="page-inner-content">
        <div className="selecao-titulo">
          <h3>{limite === "4" ? "Produtos" : ""}</h3>
          <div className="underline"></div>
          <div className="main-content">
            {erro ? <p>Erro: {erro}</p> : <ListaProduto produto={produto} />}
            {limite === "4" ? (
              <Link to="/Produto">
                <button className="btnvermais">
                  <FontAwesomeIcon icon={faSearch} style={{ marginRight: "8px" }} />
                  Ver Mais
                </button>
              </Link>
            ) : (
              <div className="pagination">
                <button onClick={handlePaginaAnterior} disabled={pagina === 1} className="pagination-button">
                  Página Anterior
                </button>
                <span>Página {pagina}</span>
                <button onClick={handleProximaPagina} className="pagination-button">
                  Próxima Página
                </button>
              </div>
            )}
            <Sessaoexclusiva />
            <SobreNos />
            <Listacomentario />
            <Mapa/>
          </div>
        </div>
      </div>
    </>
  );
}
