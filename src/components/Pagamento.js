import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfigurarCartao from "./ConfigurarCartao";
import { usePagamento } from "./PagamentoContext";
import { useTipoCliente } from "./PrecoContext";
import { QRCodeCanvas } from "qrcode.react";

export default function Pagamento() {
  const { produtos, total, clearCart } = useCart();
  const [cepDestino, setCepDestino] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [valorFrete, setValorFrete] = useState(0);
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [mostrarConfigurarCartao, setMostrarConfigurarCartao] = useState(false);
  const [codigoPagamento, setCodigoPagamento] = useState(null);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [contador, setContador] = useState(60);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [mostrarCep, setMostrarCep] = useState(true);
  const [retirarNaLoja, setRetirarNaLoja] = useState(false);
  const { TipoCliente } = useTipoCliente();
  const [cepDesabilitado, setCepDesabilitado] = useState(false);
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

  useEffect(() => {
    let timer;
    if (qrCodeBase64 && contador > 0 && !pagamentoConfirmado) {
      timer = setInterval(() => {
        setContador((prev) => prev - 1);
      }, 1000);
    } else if (contador === 0) {
      verificarPagamento();
    }
    return () => clearInterval(timer);
  }, [qrCodeBase64, contador, pagamentoConfirmado]);

  const enviarPagamentoPix = async () => {
    const produto = produtos[0]
    try {
      const response = await axios.post("https://equilibrioapperp.pontalsistemas.com.br/ServerEcommerce/MercadoPago", {
        Grupo: "343",
        Empresa: "682",
        Pessoa: idPessoa,
        Produto: produto.id,
        ChaveAPI:"APP_USR-5998987835151881-031812-37e9788175d1c99a31553fa2f7870064-1319414806",
        Valor: total.toFixed(2).replace(".", ","),
      }, {
        headers: {
          "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
          "Content-Type": "application/json",
        },
      });
      
      if (response.data && response.data.CHAVEPAGAMENTO) {
        setQrCodeBase64(response.data.CHAVEPAGAMENTO);
      } else {
        console.error("Erro: CHAVEPAGAMENTO não encontrado na resposta da API.");
        alert("Erro ao processar o pagamento. Verifique se seu e-mail é válido e entre em contato com o suporte.");
      }

      if (response.data && response.data.payment_id) {
        setPaymentId(response.data.payment_id);
      } else {
        console.error("Erro: payment_id não encontrado na resposta da API.");
      }

      setContador(1);
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
    }
  };

  const verificarPagamento = async () => {
    try {
      if (!paymentId) {
        console.error("Erro: payment_id não definido.");
        return;
      }
      const response = await axios.post("https://equilibrioapperp.pontalsistemas.com.br/ServerEcommerce/StatusPagamento", {
        payment_id: paymentId,
        ChaveAPI:"APP_USR-5998987835151881-031812-37e9788175d1c99a31553fa2f7870064-1319414806",
      }, {
        headers: {
          "X-Embarcadero-App-Secret": "DE1BA56B-43C5-469D-9BD2-4EB146EB8473",
          "Content-Type": "application/json",
        },
      });

      if (response.data.Status === "approved") {
        setPagamentoConfirmado(true);
        finalizarCompra();
      } else if (response.data.Status === "pending") {
        setContador(1);
      } else {
        console.log("Status do pagamento: " + response.data.Status);
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    }
  };

  const copiarCodigoPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeBase64);
      alert("Código PIX copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar o código PIX:", error);
      alert("Erro ao copiar o código PIX. Tente novamente.");
    }
  };

  const calcularPesoTotal = () => {
    return produtos.reduce((total, produto) => {
      const pesoBruto = parseFloat(produto.PesoBruto) || 0.6;
      return total + pesoBruto * produto.quantidade;
    }, 0);
  };

  const handleClose = () => {
    setMostrarConfigurarCartao(false);
  };
  
  const handleRetirarNaLoja = (event) => {
    const checked = event.target.checked;
    setRetirarNaLoja(checked);
    setMostrarCep(!checked);
    setCepDesabilitado(checked);
  };

  const handleSave = (dadosCartao) => {
    console.log("Cartão salvo:", dadosCartao);
    setMostrarConfigurarCartao(false);
  };

  const handlePagamentoSelecionado = (codigo) => {
    setCodigoPagamento(codigo);
  };
   
  const calcularQtdeVolume = () => {
    return produtos.reduce((total, produto) => {
      return total + produto.quantidade;
    }, 0);
  };

  const finalizarCompra = async () => {
    if (retirarNaLoja) {
      console.log("Produto retirado na loja");
    } else {
      if (!cepDestino || cepDestino.replace(/[^\d]/g, "").length !== 8) {
        alert("Por favor, insira um CEP válido e calcule o frete antes de finalizar a compra.");
        return;
      }
    }

    if (!codigoPagamento) {
      alert("Selecione um método de pagamento antes de finalizar a compra.");
      return;
    }
    
    if (codigoPagamento === 7 && !pagamentoConfirmado) {
      await enviarPagamentoPix();
      return;
    }
  
    console.log("Código do pagamento selecionado:", codigoPagamento);
    
    try {
      const itens = produtos.map((produto) => {
        const precoUnit = produto.preco.toFixed(2).replace(".", ",");
        const desconto = produto.desconto || 0;
        const totalItem = (produto.preco - desconto) * produto.quantidade;
        
        return {
          IDProduto: produto.id,
          Qtde: produto.quantidade,
          vUnt: precoUnit,
          vDesc: desconto.toFixed(2).replace(".", ","),
          vTotalItem: totalItem.toFixed(2).replace(".", ","),
        };
      });
      
      const gerarFinanceiro = (codigoPagamento) => {
        switch (codigoPagamento) {
          case 1: // Cartão de Débito
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "478",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          case 2: // Cartão de Crédito
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "477",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          case 3: // Carteira
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "479",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          case 4: // Boleto (apenas marca como boleto, sem integração com API)
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "480",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          case 7: // Pix
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "508",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          case 10: // Depósito
            return {
              TipoPg: codigoPagamento.toString(),
              NSU: "98938378",
              IDForPg: "486",
              Qtde: "1",
              DtVencimento: new Date().toISOString().split("T")[0],
              Parcela: "1/1",
              vParcela: total.toFixed(2).replace(".", ","),
            };
          default:
            throw new Error("Código de pagamento inválido.");
        }
      };

      const financeiro = [gerarFinanceiro(codigoPagamento)];

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://equilibrioapperp.pontalsistemas.com.br/ServerEcommerce/NovaVenda",
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
          MovimentouEstoque: "0",
          LocalVenda: "1",
          TipoMovim: "1",
          EmiteNFCe: "0",
          vProduto: total.toFixed(2).replace(".", ","),
          vNFe: total.toFixed(2).replace(".", ","),
          TipoNFe: "1",
          PessoaEmpresa: "0",
          Troco: "0",
          Editar: "0",
          IDVenda: "0",
          TipoPg: codigoPagamento.toString(),
          StatusTransacao: "1",
          ValidarValor:"0",
          TipoCliente: TipoCliente,
          Itens: itens,
          Financeiro: financeiro,
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.Venda) {
        alert(`Compra finalizada com sucesso! ID da Venda: ${response.data.Venda}`);
        console.log("Resposta da API:", response.data);
        
        clearCart();
        navigate("/");
      } else {
        const mensagemErro = response.data.erro || "Erro desconhecido";
        alert(`Erro ao processar a compra: ${mensagemErro}`);
        console.error("Erro na API:", response.data);
      }
    } catch (error) {
      alert("Ocorreu um erro ao processar sua compra. Verifique os dados e tente novamente.");
      console.error("Erro ao finalizar compra:", error);
    }
  };

  const handleMetodoPagamentoChange = (metodo) => {
    console.log("ID Pessoa atual:", idPessoa);
    setMetodoPagamento(metodo);
    setMostrarConfigurarCartao(metodo === "Cartao");

    if (metodo === "Boleto") {
      setCodigoPagamento(4); // 4 é o código para Boleto
    } else if (metodo === "Pix") {
      setCodigoPagamento(7); // 7 é o código para PIX
    } else if (metodo === "Cartao") {
      setCodigoPagamento(2); // 2 é o código para Cartão de Crédito
    }
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

    const pesoTotal = calcularPesoTotal();
    const qtdeVolume = calcularQtdeVolume();
        
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
          PesoBruto: pesoTotal.toFixed(2).replace(".", ","),
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
        </div>

        {/* Card de endereço */}
        <div className="pagamento-card">
         <h3 className="pagamento-card-title">Endereço de Entrega</h3>
         <div className="pagamento-retirar-loja">
         <label>
         <input
           type="checkbox"
           checked={retirarNaLoja}
           onChange={handleRetirarNaLoja}
         /> Retirar na Loja
         </label>
          </div>
          {mostrarCep && (
          <input
            type="text"
            placeholder="Digite o CEP de Destino"
            value={cepDestino}
            onChange={(e) => setCepDestino(e.target.value)}
            disabled={cepDesabilitado}
            className="pagamento-endereco-input"
          />
           )}
          
          {!retirarNaLoja && (
            <>
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
              <div className="pagamento-buttons-container">
                <button
                  onClick={() => buscarEnderecoPorCep(cepDestino)}
                  className="pagamento-buscar-cep-btn"
                >
                  Buscar Endereço
                </button>
                <button
                  onClick={calcularFrete}
                  className="pagamento-calcular-frete-btn"
                >
                  Calcular Frete
                </button>
              </div>
            </>
          )}
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
                onChange={() => {
                  setCodigoPagamento(7);
                  handleMetodoPagamentoChange("Pix");
                }}
              />
              PIX
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

            {qrCodeBase64 && (
              <div className="qr-code-container">
                <h3>Escaneie o QR Code para pagar</h3>
                <QRCodeCanvas value={qrCodeBase64} size={256} />
                <p>Tempo restante: {contador} segundos</p>
                {pagamentoConfirmado ? (
                  <p>Pagamento Confirmado!</p>
                ) : (
                  <>
                    <p>Aguardando pagamento...</p>
                    <button onClick={copiarCodigoPix} className="copiar-pix-btn">
                      Copiar Código PIX
                    </button>
                  </>
                )}
              </div>
            )}

            {metodoPagamento === "Cartao" && (
              <button onClick={() => setMostrarConfigurarCartao(true)}>
                Configurar Cartão
              </button>
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