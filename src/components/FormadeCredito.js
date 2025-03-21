import React, { useState } from "react";
import { useCadastro } from "./CadastroContext";
import { usePagamento } from "./PagamentoContext";

const FormadeCredito = ({ onClose, onSave, onPagamentoSelecionado }) => {
  const { formasPagamento, ValorCredito } = useCadastro();
  const { obterFormasPagamento } = usePagamento(); // Pegando as formas de pagamento do contexto de pagamento
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [codigoPagamento, setCodigoPagamento] = useState(null);

  const codigosPagamento = {
    "Boleto": 4,
    "CartaoDebito": 1,
    "Cartão de Crédito": 2,
    "Pix": 7,
    "Carteira": 3,
    "Cheque": 5,
    "Depósito": 10,
    "Credito": 12,
    "Correntista": 13,
  };

  const metodosDisponiveis = obterFormasPagamento
    ? obterFormasPagamento()
    : [
        { key: "boleto", label: "Boleto" },
        { key: "CartaoCredito", label: "Cartão de Crédito" },
        { key: "cartaoNaoPresencial", label: "Cartão Não Presencial" },
        { key: "pixCredito", label: "Pix" },
        { key: "carteira", label: "Carteira" },
        { key: "cheque", label: "Cheque" },
        { key: "correntista", label: "Correntista" },
        { key: "deposito", label: "Depósito" },
      ];

  const handleMetodoPagamento = (metodo, key) => {
    const limite = ValorCredito?.[key] || 0;

    if (formasPagamento && formasPagamento[key] !== "1") {
      alert("Forma de pagamento não autorizada para seu cadastro.");
    } else if (limite > 0) {
      setMensagemErro(`Seu limite para ${metodo} é de R$ ${limite.toFixed(2)}.`);
      setMetodoPagamento(metodo);
      setCodigoPagamento(codigosPagamento[metodo]);
      onPagamentoSelecionado(codigosPagamento[metodo]); // Passa o código de pagamento
    } else {
      setMensagemErro("");
      setMetodoPagamento(metodo);
      setCodigoPagamento(codigosPagamento[metodo]);
      onPagamentoSelecionado(codigosPagamento[metodo]); // Passa o código de pagamento
    }
  };

  return (
    <div className="formade-credito">
      <h2>Escolha a forma de pagamento</h2>
      {formasPagamento ? (
        <div className="opcoes-pagamento">
          {metodosDisponiveis.map(({ key, label }) => (
            <button
              key={key}
              className="btn-pagamento"
              onClick={() => handleMetodoPagamento(label, key)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <p>Carregando opções de pagamento...</p>
      )}

      {metodoPagamento && <p className="metodo-selecionado">Você escolheu: {metodoPagamento}</p>}
      {mensagemErro && <p className="erro-pagamento">{mensagemErro}</p>}
      {ValorCredito !== null && (
        <p className="limite-credito">Seu limite total de crédito: <strong>R$ {ValorCredito}</strong></p>
      )}
      {/* {codigoPagamento && (
        <p className="codigo-pagamento">Código de pagamento: <strong>{codigoPagamento}</strong></p>
      )} */}
    </div>
  );
};

export default FormadeCredito;