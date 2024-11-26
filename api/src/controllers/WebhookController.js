async function handlePaymentWebhook(req, res) {
  try {
    const { data } = req.body;
    
    // Verificar status do pagamento
    if (data.type === 'payment') {
      const paymentId = data.id;
      // Atualizar status do pagamento no seu banco de dados
    }

    res.status(200).send();
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send();
  }
} 