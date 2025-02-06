import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Rodape from "./components/Rodape";
import HomePage from "./components/pages/HomePage";
import Produtopagina from "./components/pages/Produtopagina";
import Pagamento from "./components/Pagamento";
import Login from "./components/Login";
import Registro from "./components/Registro";
import ProdutoDetalhe from "./components/ProdutoDetalhe"; // Página de detalhes do produto
import { CartProvider } from "./components/CartContext";
import { PesquisaProvider, usePesquisa } from "./components/PesquisaContext";
import axios from "axios";
import Loading from "./components/Loading";
import { CadastroProvider } from "./components/CadastroContext"; // Importando o CadastroProvider corretamente
import { PrecoProvider } from "./components/PrecoContext";
import Contato from "./components/Contato";
import { CartaoProvider } from "./components/CartaoContext";
function App() {
  const [produto, setProduto] = useState([]);
  const [erro, setErro] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <CartProvider>
      <CadastroProvider>
        <PesquisaProvider>
        <PrecoProvider>
          <CartaoProvider>
          <Router>
            <div className="App">
              <Navbar />
              <MainContent
                produto={produto}
                setProduto={setProduto}
                erro={erro}
                setErro={setErro}
                pagina={pagina}
                setPagina={setPagina}
                loading={loading}
                setLoading={setLoading}
              />
              <Rodape />
            </div>
          </Router>
          </CartaoProvider>
          </PrecoProvider>
        </PesquisaProvider>
      </CadastroProvider>
    </CartProvider>
  );
}

function MainContent({ produto, setProduto, erro, setErro, pagina, setPagina, loading, setLoading }) {
  const location = useLocation();
  const { searchTerm } = usePesquisa();
  const [limite, setLimite] = useState("4");

  useEffect(() => {
    const novoLimite = searchTerm ? "" : location.pathname === "/" ? "4" : "12";
    setLimite(novoLimite);
    setLoading(true);

    const config = {
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
        TipoPesquisa: "G",
        Campo: "",
        Valor: searchTerm,
        limite: novoLimite,
        Paginacao: pagina,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Resposta da API:", response.data);
        setProduto(response.data.produtos || response.data);
        setErro(null);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setErro(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagina, location.pathname, searchTerm, limite]); // A dependência de "limite" foi adicionada

  const handleProximaPagina = () => setPagina((prev) => prev + 1);
  const handlePaginaAnterior = () => setPagina((prev) => Math.max(prev - 1, 1));

  return (
    <main>
      {loading && <Loading />}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              produto={produto}
              erro={erro}
              limite={limite}
              pagina={pagina}
              handleProximaPagina={handleProximaPagina}
              handlePaginaAnterior={handlePaginaAnterior}
            />
          }
        />
        <Route
          path="/Produto"
          element={
            <Produtopagina
              produto={produto}
              erro={erro}
              pagina={pagina}
              handleProximaPagina={handleProximaPagina}
              handlePaginaAnterior={handlePaginaAnterior}
            />
          }
        />
        <Route
          path="/detalhe-produto/:id"
          element={<ProdutoDetalhe produto={produto} />}
        />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cont" element={<Contato />} />
      </Routes>
    </main>
  );
}

export default App;