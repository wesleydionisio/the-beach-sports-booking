const Booking = require('../models/Booking');
const dayjs = require('dayjs');

exports.getDashboardMetrics = async (req, res) => {
  try {
    console.log('Backend: Iniciando busca de métricas');
    
    const hoje = dayjs();
    const inicioDoDia = hoje.startOf('day').toDate();
    const fimDoDia = hoje.endOf('day').toDate();

    // Total de Reservas
    const totalReservas = await Booking.countDocuments({
      status: { $ne: 'cancelada' }
    });

    // Receita Total
    const receitaResult = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelada' },
          payment_status: { $ne: 'refunded' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const receitaTotal = receitaResult[0]?.total || 0;

    // Reservas de Hoje
    const reservasHoje = await Booking.countDocuments({
      data: {
        $gte: inicioDoDia,
        $lte: fimDoDia
      },
      status: { $ne: 'cancelada' }
    });

    // Horários de Pico
    const horariosPico = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelada' }
        }
      },
      {
        $group: {
          _id: '$horario_inicio',
          totalReservas: { $sum: 1 }
        }
      },
      {
        $sort: { 
          _id: 1 // Ordenar por horário
        }
      },
      {
        $project: {
          horario: '$_id',
          totalReservas: 1,
          _id: 0
        }
      }
    ]);

    console.log('Backend: Horários de pico:', horariosPico);

    // Últimas Reservas - Ajustado para trazer mais informações e ordenação correta
    const ultimasReservas = await Booking.find({})  // Removido filtro de status para ver todas
      .sort({ createdAt: -1 }) // Ordenar por data de criação
      .limit(5)
      .populate('usuario_id', 'nome email')
      .populate('quadra_id', 'nome')
      .populate('esporte', 'nome')
      .select('usuario_id quadra_id data horario_inicio horario_fim status total esporte createdAt');

    console.log('Backend: Últimas reservas encontradas:', 
      ultimasReservas.map(r => ({
        id: r._id,
        data: r.data,
        status: r.status,
        cliente: r.usuario_id?.nome,
        total: r.total
      }))
    );

    res.json({
      success: true,
      metrics: {
        totalReservas,
        receitaTotal,
        reservasHoje,
        horariosPico,
        ultimasReservas
      }
    });

  } catch (error) {
    console.error('Backend: Erro ao buscar métricas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar métricas do dashboard',
      error: error.message
    });
  }
}; 