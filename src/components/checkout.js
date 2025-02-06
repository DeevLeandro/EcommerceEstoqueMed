const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
app.use(express.json());

// Configuração do Mercado Pago
MercadoPago.configurations.setAccessToken('TEST-3149519071662225-110421-82693ef6f794b3e47af943b37dc39f95-491988103');

app.post('/api/pagamento', async (req, res) => {
  const { transaction_amount, payment_method_id, endereco_entrega } = req.body;

  try {
    // Criação do pagamento
    const paymentData = {
      transaction_amount: transaction_amount,
      payment_method_id: payment_method_id,
      payer: {
        email: 'test_user@test.com',
      },
      additional_info: {
        shipping: {
          address: {
            street_name: endereco_entrega,
          },
        },
      },
    };

    const payment = await MercadoPago.payment.save(paymentData);

    if (payment.status === 'approved') {
      res.json({
        message: 'Pagamento aprovado',
        qr_code_base64: payment.point_of_interaction.transaction_data.qr_code_base64, // QR code base64
      });
    } else {
      res.status(400).json({ error: 'Erro no pagamento' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o pagamento' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
