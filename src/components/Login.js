import React, { useState } from "react";
import axios from "axios";
import { resolvePath, useNavigate } from "react-router-dom";
import { useCadastro } from "./CadastroContext";
import { useTipoCliente } from "./PrecoContext";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { 
    setTemCadastro, 
    setNomeCliente, 
    setFormasPagamento, 
    setValorCredito, 
    setParcelas 
  } = useCadastro();
  const { setTipoCliente } = useTipoCliente();

  const limparCPF = (cpf) => cpf.replace(/\D/g, "");

  const validarCPF = (cpf) => cpf && cpf.length >= 11;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    const cpfLimpo = limparCPF(cpf);

    if (!validarCPF(cpfLimpo)) {
      setErro("Digite um CPF/CNPJ válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "https://equilibrioapperp.pontalsistemas.com.br/ServerEcommerce/ConsultarCadastro",
        {
          headers: {
            "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
            "Content-Type": "application/json",
          },
          params: {
            Token: "7QDLJV9OHHIJBHYGJM8Y",
            Grupo: "343",
            Empresa: "682",
            CNPJCPF: cpfLimpo,
          },
        }
      );

      console.log("Resposta da API:", response.data);

      if (response.data?.ID) {
        setMensagem("Você já possui cadastro.");
        setTemCadastro(true);
        setTipoCliente(response.data.TipoCliente);
        setNomeCliente(response.data.Nome);
        setValorCredito(response.data.ValorCredito);
        setFormasPagamento({
          boleto: response.data.Boleto,
          CartaoCredito: response.data.CartaoCredito,
          cartaoNaoPresencial: response.data.CartaoNaoPresencial,
          carteira: response.data.Carteira,
          cheque: response.data.Cheque,
          correntista: response.data.Correntista,
          deposito: response.data.Despito,
          pixCredito: response.data.PixCredito,
        });
        
        // Corrigido: Passando o array de parcelas corretamente
        if (response.data.Parcelas && Array.isArray(response.data.Parcelas)) {
          setParcelas(response.data.Parcelas);
        } else {
          setParcelas([]);
        }
        
        localStorage.setItem("userID", response.data.ID);
        navigate("/");
      } else {
        setErro("CPF/CNPJ Não Encontrado.");
      }
    } catch (error) {
      setErro("Erro ao verificar cadastro. Por favor, tente novamente.");
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2 className="login-title">Verificar Cadastro</h2>
        {erro && <p className="login-error">{erro}</p>}
        {mensagem && <p className="login-message">{mensagem}</p>}
        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="CPF ou CNPJ"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            disabled={loading}
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        <button className="go-to-cadastro" onClick={() => navigate("/registro")}>
          <p>Não tem uma conta?</p> Cadastre-se
        </button>
      </div>
    </div>
  );
}