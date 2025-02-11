import React, { useState } from "react";
import Produto from "./Produto";
import { usePesquisa } from "./PesquisaContext";
import MenuCategoria from "./Menucategoria";

export default function ListaProduto({ produto }) {
  const { searchTerm } = usePesquisa();
  const produtos = Array.isArray(produto) ? produto : [];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  

  // Filtra os produtos com base na categoria selecionada
  const produtosFiltradosPorCategoria = categoriaSelecionada
    ? produtos.filter((item) => item.GrupoProduto === categoriaSelecionada)
    : produtos;

  // Filtra também com base no termo de pesquisa
  const produtosFiltrados = produtosFiltradosPorCategoria.filter((item) =>
    item.Produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lista-produto-container">
      {/* Menu de Categorias colocado dentro de ListaProduto */}
      <MenuCategoria setCategoriaSelecionada={setCategoriaSelecionada} />
      
      {/* Exibição dos Produtos */}
      <div className="lista-produto">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((item, index) => (
            <Produto
              key={index}
              id={item.IDProduto}
              nome={item.Produto}
              marca={item.Marca}
              preco={item.Atacado}
              preco2={item.Varejo}
              estoque={item.Qtde}
              image1={item.Fotos?.[0]?.Caminho}
              image2={item.Fotos?.[1]?.Caminho}
              categorias={item.Categorias} // Passa as categorias para o Produto
            />
          ))
        ) : (
          <p>Nenhum produto encontrado</p>
        )}
      </div>
    </div>
  );
}
