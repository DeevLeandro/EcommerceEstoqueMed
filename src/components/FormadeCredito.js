import React, { useState } from "react";
import { useCadastro } from "./CadastroContext";

const FormadeCredito = () => {
  const { formasPagamento, limitesPagamento } = useCadastro();
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const handleMetodoPagamento = (metodo, key) => {
    const limite = limitesPagamento?.[key] || 0; // Obtém o limite disponível, se existir
    
    if (formasPagamento[key] !== "1") {
      setMensagemErro(`Você não possui limite suficiente para ${metodo}.`);
    } else if (limite > 0) {
      setMensagemErro(`Seu limite para ${metodo} é de R$ ${limite.toFixed(2)}.`);
      setMetodoPagamento(metodo);
    } else {
      setMensagemErro("");
      setMetodoPagamento(metodo);
    }
  };

  const metodosDisponiveis = [
    { key: "boleto", label: "Boleto" },
    { key: "cartaoCredito", label: "Cartão de Crédito" },
    { key: "cartaoNaoPresencial", label: "Cartão Não Presencial" },
    { key: "pixCredito", label: "Pix" },
    { key: "carteira", label: "Carteira" },
    { key: "cheque", label: "Cheque" },
    { key: "correntista", label: "Correntista" },
    { key: "deposito", label: "Depósito" },
  ];

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
    </div>
  );
};

export default FormadeCredito;
