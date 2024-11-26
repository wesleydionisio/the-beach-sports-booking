const MercadoPagoService = require('../services/MercadoPagoService');
const Booking = require('../models/Booking');

class PaymentController {
  constructor() {
    this.mercadoPagoService = new MercadoPagoService();
  }

  async createPayment(req, res) {
    try {
      console.log('Criando pagamento:', req.body);
      const { bookingId } = req.body;
      
      // Buscar informações da reserva
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Reserva não encontrada'
        });
      }

      const paymentData = {
        amount: booking.total,
        description: `Reserva #${booking._id}`,
        payer: {
          email: req.user?.email || 'test@test.com',
          firstName: req.user?.firstName || 'Test',
          lastName: req.user?.lastName || 'User'
        }
      };

      const payment = await this.mercadoPagoService.createPixPayment(paymentData);
      
      // Atualizar a reserva com as informações do pagamento
      await Booking.findByIdAndUpdate(bookingId, {
        payment_id: payment.id,
        payment_status: payment.status
      });

      console.log('Pagamento criado:', payment);

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar pagamento',
        error: error.message
      });
    }
  }

  async handleWebhook(req, res) {
    try {
      const { data } = req.body;
      
      if (data.type === 'payment') {
        const payment = await this.mercadoPagoService.checkPaymentStatus(data.id);
        
        await Booking.findOneAndUpdate(
          { payment_id: data.id },
          { payment_status: payment.status }
        );
      }
      
      res.sendStatus(200);
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.sendStatus(500);
    }
  }

  async getPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;
      console.log('Verificando status do pagamento:', paymentId);
      
      const status = await this.mercadoPagoService.checkPaymentStatus(paymentId);
      
      // Atualizar a reserva com o novo status
      if (status === 'approved') {
        await Booking.findOneAndUpdate(
          { payment_id: paymentId },
          { 
            payment_status: status,
            status: 'confirmada'
          }
        );
      }
      
      res.json({
        success: true,
        status
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      res.json({
        success: false,
        status: 'pending',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentController(); 