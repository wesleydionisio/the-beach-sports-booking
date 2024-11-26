const { MercadoPagoConfig, Payment } = require('mercadopago');

class MercadoPagoService {
    constructor() {
        this.client = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
        });
        this.payment = new Payment(this.client);
    }

    async createPixPayment(data) {
        try {
            console.log('Criando pagamento PIX:', data);
            
            const paymentData = {
                transaction_amount: Number(data.amount),
                description: data.description,
                payment_method_id: 'pix',
                payer: {
                    email: data.payer.email,
                    first_name: data.payer.firstName,
                    last_name: data.payer.lastName,
                    identification: {
                        type: 'CPF',
                        number: '12345678909'
                    }
                }
            };

            console.log('Dados do pagamento a serem enviados:', paymentData);

            const response = await this.payment.create({ body: paymentData });
            console.log('Resposta do Mercado Pago:', response);
            
            return {
                id: response.id,
                status: response.status,
                transaction_amount: response.transaction_amount,
                point_of_interaction: response.point_of_interaction,
                date_of_expiration: response.date_of_expiration
            };
        } catch (error) {
            console.error('Erro detalhado ao criar pagamento PIX:', error);
            throw error;
        }
    }

    async checkPaymentStatus(paymentId) {
        try {
            console.log('Verificando status do pagamento:', paymentId);
            
            const response = await this.payment.get({ id: paymentId });
            const status = response.status || response.data?.status;
            
            console.log('Status do pagamento:', status);
            return status;
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            throw error;
        }
    }
}

module.exports = MercadoPagoService; 