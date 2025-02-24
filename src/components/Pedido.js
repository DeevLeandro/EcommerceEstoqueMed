import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedido = () => {
  const [idPessoa, setIdPessoa] = useState(localStorage.getItem('userID') || '223039');
  const [pedidos, setPedidos] = useState([]); // Alterei para ser uma lista de pedidos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://equilibrioapperp.pontalsistemas.com.br/serverecommerce/PesquisarPedidos',
          {
            headers: {
              'X-Embarcadero-App-Secret': 'DE1BA56B-43C5-469D-9BD2-4EB146EB8473',
              'Content-Type': 'application/json',
            },
            params: {
              Token: '7QDLJV9OHHIJBHYGJM8Y',
              Grupo: '343',
              Empresa: '682',
              Pessoa: idPessoa,
            },
          }
        );

        console.log('Resposta da API:', response.data); // Log da resposta

        // Verifica se a resposta é um array e atualiza o estado com a lista de pedidos
        if (Array.isArray(response.data)) {
          setPedidos(response.data.map(pedido => ({
            id: pedido.ID,
            nome: pedido.Nome,
            dataPedido: pedido.DataPedido,
            valor: pedido.Valor,
            tipoPagamento: pedido.TipoPagamento,
            liberacao: pedido.Liberacao === '1' ? 'Pedido em análise' : 'Liberado',
            classeLiberacao: pedido.Liberacao === '1' ? 'analise' : 'liberado',
          })));
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        if (error.response) {
          console.error('Erro no response:', error.response.data);
        } else if (error.request) {
          console.error('Erro na requisição:', error.request);
        } else {
          console.error('Erro ao configurar a requisição:', error.message);
        }
      }
    };

    fetchData();
  }, [idPessoa]);

  return (
    <div className="pedido-container">
      <h2>Pedidos</h2>
      {pedidos.length > 0 ? (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="pedido-detalhes">
            <p><strong>ID:</strong> {pedido.id}</p>
            <p><strong>Nome:</strong> {pedido.nome}</p>
            <p><strong>Tipo de Pagamento:</strong> {pedido.tipoPagamento}</p>
            <p><strong>Valor:</strong> {pedido.valor}</p>
            <p><strong>Data do Pedido:</strong> {pedido.dataPedido}</p>
            <p className={`pedido-liberacao ${pedido.classeLiberacao}`}>
              <strong>Liberação:</strong> {pedido.liberacao}
            </p>
          </div>
        ))
      ) : (
        <p className="pedido-carregando">Carregando pedidos...</p>
      )}
    </div>
  );
};

export default Pedido;
