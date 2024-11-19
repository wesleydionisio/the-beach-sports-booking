const PaymentMethod = require('../models/PaymentMethod');

// Listar todos os métodos de pagamento ativos
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ active: true });
    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Erro ao buscar métodos de pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar métodos de pagamento'
    });
  }
};

// Criar novo método de pagamento
exports.createPaymentMethod = async (req, res) => {
  try {
    const { label, icon } = req.body;
    const paymentMethod = await PaymentMethod.create({ label, icon });
    
    res.status(201).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar método de pagamento'
    });
  }
};

// Atualizar método de pagamento
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, icon, active } = req.body;
    
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      id,
      { label, icon, active },
      { new: true, runValidators: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Método de pagamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar método de pagamento'
    });
  }
};

// Excluir método de pagamento
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Método de pagamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir método de pagamento'
    });
  }
}; 