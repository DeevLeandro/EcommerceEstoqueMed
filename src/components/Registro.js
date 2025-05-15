import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [ibge, setIbge] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [contato, setContato] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post(
        "https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/NovaPessoa",
        {
          Grupo: "343",
          Empresa: "682",
          Token: "7QDLJV9OHHIJBHYGJM8Y",
          CnpjCpf: cnpjCpf,
          Nome: nome,
          Contato: contato,
          Endereco: logradouro,
          Bairro: bairro,
          Cidade: cidade,
          Cep: cep,
          UF: estado,
          Email: email,
          Numero: numero,
          Complemento: complemento,
          Ibge: ibge,
          Telefone: telefone,
          IE: "",
          RazaoSocial: razaoSocial,
        },
        {
          headers: {
            "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta da API:", response.data);

      if (response.data && response.data.ID) {
        alert(`Cadastro realizado com sucesso. ID: ${response.data.ID}`);
        navigate("/login");
      } else {
        alert("Erro ao registrar, verifique seus dados!");
      }
    } catch (error) {
      setErro("Erro ao registrar.");
      console.error("Erro na requisição:", error.response?.data || error.message);
    }
  };

  const buscarEndereco = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setCep(cepValue);

    if (cepValue.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cepValue}/json/`
        );
        if (response.data.erro) {
          setErro("CEP não encontrado.");
        } else {
          setLogradouro(response.data.logradouro);
          setBairro(response.data.bairro);
          setCidade(response.data.localidade);
          setEstado(response.data.uf);
          setIbge(response.data.ibge);
          setErro(""); // Limpa mensagem de erro
        }
      } catch (error) {
        setErro("Erro ao buscar endereço.");
        console.error(error);
      }
    }
  };

  return (
    <div className="registro">
      <h2>Cadastro</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleRegistro}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contato"
          value={contato}
          onChange={(e) => setContato(e.target.value)}
        />
        <input
          type="text"
          placeholder="CNPJ/CPF"
          value={cnpjCpf}
          onChange={(e) => setCnpjCpf(e.target.value.replace(/\D/g, ""))}
        />
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={buscarEndereco}
        />
        <input
          type="text"
          placeholder="Logradouro"
          value={logradouro}
          onChange={(e) => setLogradouro(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        <input
          type="text"
          placeholder="Complemento"
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <input
          type="text"
          placeholder="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
        <input
          type="text"
          placeholder="IBGE"
          value={ibge}
          onChange={(e) => setIbge(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        {cnpjCpf.length === 14 && (
          <input
            type="text"
            placeholder="Razão Social (obrigatório para CNPJ)"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />
        )}
        <button type="submit">Registrar</button>
      </form>
      <p>
        Já tem uma conta? <a href="/login">Faça Login</a>
      </p>
    </div>
  );
}
