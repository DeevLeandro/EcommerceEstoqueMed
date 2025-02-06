import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfigurarCartao from "./ConfigurarCartao";
import FormadeCredito from "./FormadeCredito";

export default function Pagamento() {
  const { produtos, total, clearCart } = useCart();

  const [cepDestino, setCepDestino] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [valorFrete, setValorFrete] = useState(0);
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [mostrarConfigurarCartao, setMostrarConfigurarCartao] = useState(false);
  const [mostrarcreditoloja, setMostrarCreditoLoja] = useState(false);
  const navigate = useNavigate();

  const [idPessoa, setIdPessoa] = useState(localStorage.getItem("userID") || "223039");

  useEffect(() => {
    const verificarLogin = () => {
      const userId = localStorage.getItem("userID");
      setIdPessoa(userId || "");
    };
    window.addEventListener("storage", verificarLogin);
    return () => window.removeEventListener("storage", verificarLogin);
  }, []);

  

// Função para calcular o peso total
const calcularPesoTotal = () => {
  return produtos.reduce((total, produto) => {
    const pesoBruto = parseFloat(produto.PesoBruto) || 0.6; // Se PesoBruto for inválido, usa 0,6
    return total + pesoBruto * produto.quantidade; // Peso total considerando a quantidade
  }, 0);

};

  // Função para fechar o modal
  const handleClose = () => {
    setMostrarConfigurarCartao(false);
  };
  
   // Função para fechar o modal
  const handlefechar = () => {
    setMostrarCreditoLoja(false);
  };
  
  // Função para salvar o cartão
  const handleSave = (dadosCartao) => {
    console.log("Cartão salvo:", dadosCartao);
    setMostrarConfigurarCartao(false);
  };

    // Função para salvar o pagamento
    const handleSalvarpagamento = (pagamento) => {
      console.log("salvar pagamento:", pagamento);
      setMostrarCreditoLoja(false);
    };

const calcularQtdeVolume = () => {
  return produtos.reduce((total, produto) => {
    return total + produto.quantidade; // Soma a quantidade de cada produto no carrinho
  }, 0);
};

const codigosPagamento = {
  "Boleto": 4,
  "CartaoDebito": 1,
  "CartaoCredito": 2,
  "Pix": 7,
  "Carteira": 3,
  "Cheque": 5,
  "Deposito": 10,
  "Credito":12,
  "Correntista": 13
};

  const finalizarCompra = async () => {
    
   // Verificar se o CEP foi preenchido
   if (!cepDestino || cepDestino.replace(/[^\d]/g, "").length !== 8) {
    alert("Por favor, insira um CEP válido e calcule o frete antes de finalizar a compra.");
    return;
  }

  // Verificar se o frete foi calculado
  if (valorFrete <= 0) {
    alert("Por favor, calcule o frete antes de finalizar a compra.");
    return;
  }

  // Verificar se uma forma de pagamento foi escolhida
  if (!metodoPagamento) {
    alert("Por favor, selecione uma forma de pagamento antes de finalizar a compra.");
    return;
  }
  
  const tipoPagamento = codigosPagamento[metodoPagamento] || 4; // Usa 4 (Boleto) como padrão se não encontrar
        
    try {
      const itens = produtos.map((produto) => {
        const precoUnit = produto.preco.toFixed(2).replace(".", ",");
        const desconto = produto.desconto || 0; // Adiciona o desconto, caso exista
        const totalItem = (produto.preco - desconto) * produto.quantidade;
        

        return {
          IDProduto: produto.id,
          Qtde: produto.quantidade,
          vUnt: precoUnit,
          vDesc: desconto.toFixed(2).replace(".", ","),
          vTotalItem: totalItem.toFixed(2).replace(".", ","),
        };
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/NovaVenda",
        headers: {
          "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
          "Content-Type": "application/json",
        },
        data: {
          Grupo: "343",
          Empresa: "682",
          Token: "7QDLJV9OHHIJBHYGJM8Y",
          IDPessoa: idPessoa,
          IDVendedor: "223805",
          IDTransp: "",
          LocalVenda: "1",
          TipoMovim: "1",
          EmiteNFCe: "0",
          vProduto: total.toFixed(2).replace(".", ","),
          vNFe: (total + valorFrete).toFixed(2).replace(".", ","),
          TipoNFe: "1",
          PessoaEmpresa: "0",
          Troco: "0",
          Editar: "0",
          IDVenda: "0",
          TipoPg: tipoPagamento.toString(),
          StatusTransacao: "1",
          Itens: itens,
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.Venda) {
        alert(`Compra finalizada com sucesso! ID da Venda: ${response.data.Venda}`);
        console.log("Resposta da API:", response.data);

        // Zera o carrinho e redireciona para a tela inicial
        clearCart();
        navigate("/");
      } else {
        alert("Erro ao finalizar a compra. Tente novamente.");
        console.error("Erro na API:", response.data);
      }
    } catch (error) {
      alert("Ocorreu um erro ao processar sua compra. Verifique os dados e tente novamente.");
      console.error("Erro ao finalizar compra:", error);
    }
  };

  const handleMetodoPagamentoChange = (metodo) => {
    console.log("ID Pessoa atual:", idPessoa); // Log para depuração
    if (metodo === "CreditoLoja" && idPessoa === "223039") {
      alert("Essa forma de pagamento está disponível apenas para clientes logados.");
      return;
    }

    setMetodoPagamento(metodo);
    setMostrarConfigurarCartao(metodo === "Cartao");
    setMostrarCreditoLoja(metodo === "CreditoLoja");
  };


  const buscarEnderecoPorCep = async (cep) => {
    const cepFormatado = cep.replace(/[^\d]/g, "");
    if (cepFormatado.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
        const data = await response.json();
        if (data.erro) {
          alert("CEP não encontrado.");
        } else {
          setEnderecoEntrega(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
        }
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
        alert("Erro ao buscar o endereço. Tente novamente.");
      }
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };
  

  const calcularFrete = async () => {
    if (!cepDestino || cepDestino.replace(/[^\d]/g, "").length !== 8) {
      alert("Por favor, insira um CEP de destino válido.");
      return;
    }

    const pesoTotal = calcularPesoTotal(); // Peso total calculado aqui
    const qtdeVolume = calcularQtdeVolume(); // Calcula a quantidade total de volume
        
    try {
      const config = {
        method: "get",
        url: "https://equilibrioapperp.pontalsistemas.com.br/ServerEcommerce/ConsultarFrete",
        headers: {
          "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
          "Content-Type": "application/json",
        },
        params: {
          Token: "54918616RFBA4R4990RA38CR7A0787D2FD3E",
          CEPOrigem: "74356048",
          CEPDestino: cepDestino.replace(/[^\d]/g, ""),
          ValorNFe: total.toFixed(2).replace(".", ","),
          QtdeVolume: qtdeVolume.toString(),
          PesoBruto: pesoTotal.toFixed(2).replace(".", ","), // Peso total calculado
          Comprimento: "0",
          Altura: "0",
          Largura: "0",
          Diamentro: "0",
        },
      };

      const response = await axios.request(config);
      const data = response.data;

      console.log("Resposta completa da API de frete:", data);

      const menorFrete = data.reduce((prev, curr) => {
        return parseFloat(curr.Valor.replace(",", ".")) < parseFloat(prev.Valor.replace(",", ".")) ? curr : prev;
      });

      setValorFrete(parseFloat(menorFrete.Valor.replace(",", ".")));
      setPrazoEntrega(menorFrete.PrazoEntrega);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      alert("Erro ao calcular o frete. Tente novamente.");
    }
  };

  return (
    <div className="pagamento-container">
      <h2 className="pagamento-title">Resumo do Pedido</h2>
      
      <div className="pagamento-cards-container">
        {/* Card de produtos */}
        <div className="pagamento-card">
          <h3 className="pagamento-card-title">Produtos</h3>
          <div className="produtos-container">
            {produtos.map((produto) => (
              <div key={produto.id} className="produto-item">
                <img src="/images/Produtos.png" alt={produto.nome} className="produto-imagem" />
                <div className="produto-info">
                  <h4 className="produto-nome">{produto.nome}</h4>
                  <p className="produto-quantidade">Quantidade: {produto.quantidade}</p>
                  <p className="produto-preco">Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Card de resumo */}
        <div className="pagamento-card">
          <h3 className="pagamento-card-title">Resumo Financeiro</h3>
          <p className="pagamento-total">Total: R$ {total.toFixed(2).replace('.', ',')}</p>
          <p className="pagamento-total">Frete: R$ {valorFrete.toFixed(2).replace('.', ',')}</p>
          <p className="pagamento-total">Total com Frete: R$ {(total + valorFrete).toFixed(2).replace('.', ',')}</p>
          <p className="pagamento-prazo">Prazo de Entrega: {prazoEntrega} dias</p>
        </div>

        {/* Card de endereço */}
        <div className="pagamento-card">
          <h3 className="pagamento-card-title">Endereço de Entrega</h3>
          <input
            type="text"
            placeholder="Digite o CEP de Destino"
            value={cepDestino}
            onChange={(e) => setCepDestino(e.target.value)}
            className="pagamento-endereco-input"
          />
          
          <textarea
            value={enderecoEntrega}
            onChange={(e) => setEnderecoEntrega(e.target.value)}
            className="pagamento-endereco-textarea"
            placeholder="Endereço de entrega"
          />
          <input
            type="text"
            placeholder="Ponto de Referência"
            value={pontoReferencia}
            onChange={(e) => setPontoReferencia(e.target.value)}
            className="pagamento-endereco-input"
          />
        </div>
        <div className="pagamento-buttons-container">
            <button onClick={() => buscarEnderecoPorCep(cepDestino)} className="pagamento-buscar-cep-btn">
              Buscar Endereço
            </button>
            <button onClick={calcularFrete} className="pagamento-calcular-frete-btn">
              Calcular Frete
            </button>
          </div>
          
        {/* Card de métodos de pagamento */}
        <div className="pagamento-card">
          <h3 className="pagamento-card-title">Forma de Pagamento</h3>
          <div className="pagamento-metodos">
            <label>
              <input
                type="radio"
                name="metodoPagamento"
                value="PIX"
                onChange={() => handleMetodoPagamentoChange("Pix")}
              />
              PIX
            </label>
            <label>
              <input
                type="radio"
                name="metodoPagamento"
                value="Cartão"
                onChange={() => handleMetodoPagamentoChange("Cartao")}
              />
              Cartão
            </label>
            <label>
              <input
                type="radio"
                name="metodoPagamento"
                value="Boleto"
                onChange={() => handleMetodoPagamentoChange("Boleto")}
              />
              Boleto
            </label>  
        <div>
          <label>
           <input
            type="radio"
            name="metodoPagamento"
            value="CreditoLoja"
            onChange={() => {
            handleMetodoPagamentoChange("CreditoLoja")}}
           />
           Crédito Loja
         </label>
       </div>

            {metodoPagamento === "Cartão" &&  (
        <button onClick={() => setMostrarConfigurarCartao(true)}>
          Configurar Cartão
        </button>
 
      )}
       {mostrarcreditoloja === "CreditoLoja" && (
        
        <button onClick={() => setMostrarCreditoLoja(true)}>
          Credito Loja
        </button>
      )}
      
       {mostrarcreditoloja && (
        <FormadeCredito onClose={handlefechar} onSave={handleSalvarpagamento} />
       )}

      {mostrarConfigurarCartao && (
        <ConfigurarCartao onClose={handleClose} onSave={handleSave} />
      )}
          </div>
        </div>

      </div>

      <button onClick={finalizarCompra} className="pagamento-finalizar-compra-btn">
        Finalizar Compra
      </button>
    </div>
  );
}
