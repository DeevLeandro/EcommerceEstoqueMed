import React from "react";
import ListaProduto from "../Listaproduto";

export default function Produtopagina({produto, erro, pagina, handleProximaPagina, handlePaginaAnterior}){
    return(  <div className="page-inner-content">
        <div className="selecao-titulo">
          <h3>Lista de Produtos</h3>
          <div className="underline"></div>
          <div className="main-content">
            {erro ? <p>Erro: {erro}</p> : <ListaProduto produto={produto} />}
            <div className="pagination clécio"> {/* Adicionei a classe clécio aqui */}
              <button onClick={handlePaginaAnterior} disabled={pagina === 1} className="pagination-button">
                Página Anterior
              </button>
              <span>Página {pagina}</span>
              <button onClick={handleProximaPagina} className="pagination-button">
                Próxima Página
              </button>
            </div> 
          </div>          
        </div>
      </div>
    );
}