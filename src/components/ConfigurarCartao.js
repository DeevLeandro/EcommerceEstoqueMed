import React, { useState } from "react";

export default function ConfigurarCartao({ onClose, onSave }) {
  const [tipoCartao, setTipoCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSave = () => {
    if (!tipoCartao || !numeroCartao || !nomeTitular || !dataValidade || !cvv) {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({ tipoCartao, numeroCartao, nomeTitular, dataValidade, cvv });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Configurar Cartão</h3>

        <label>
          Tipo de Cartão:
          <select
            value={tipoCartao}
            onChange={(e) => setTipoCartao(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
          </select>
        </label>

        <label>
          Número do Cartão:
          <input
            type="text"
            placeholder="Número do Cartão"
            value={numeroCartao}
            onChange={(e) => setNumeroCartao(e.target.value)}
          />
        </label>

        <label>
          Nome do Titular:
          <input
            type="text"
            placeholder="Nome como no Cartão"
            value={nomeTitular}
            onChange={(e) => setNomeTitular(e.target.value)}
          />
        </label>

        <label>
          Data de Validade:
          <input
            type="text"
            placeholder="MM/AA"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
          />
        </label>

        <label>
          CVV:
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
          <button className="cancel-button" onClick={() => onClose()}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
