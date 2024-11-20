// src/controllers/bookingController.js

const mongoose = require('mongoose'); // **Adicionar esta linha**
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Sport = require('../models/Sport'); // Corrigido de Esporte para Sport
const User = require('../models/User'); // Adicionar importação do User se necessário
const Joi = require('joi');

// Função auxiliar para verificar disponibilidade
const verificarDisponibilidade = async (quadra_id, data, horario_inicio, horario_fim) => {
  // Buscar reservas existentes para a quadra na mesma data
  const reservasExistentes = await Booking.find({
    quadra_id,
    data,
    status: { $ne: 'cancelada' }, // Ignora reservas canceladas
    $or: [
      // Verifica se há sobreposição de horários
      {
        $and: [
          { horario_inicio: { $lte: horario_inicio } },
          { horario_fim: { $gt: horario_inicio } }
        ]
      },
      {
        $and: [
          { horario_inicio: { $lt: horario_fim } },
          { horario_fim: { $gte: horario_fim } }
        ]
      },
      {
        $and: [
          { horario_inicio: { $gte: horario_inicio } },
          { horario_fim: { $lte: horario_fim } }
        ]
      }
    ]
  });

  return reservasExistentes.length === 0;
};

// Função auxiliar para calcular horários nobres
const calcularHorariosNobres = async (quadraId, dataReferencia) => {
  try {
    // Calcular início e fim da semana
    const inicioSemana = new Date(dataReferencia);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 6);

    // Buscar todas as reservas da semana
    const reservasSemana = await Booking.find({
      quadra_id: quadraId,
      data: {
        $gte: inicioSemana,
        $lte: fimSemana
      },
      status: { $ne: 'cancelada' }
    });

    // Contagem de frequência dos horários
    const frequenciaHorarios = {};
    reservasSemana.forEach(reserva => {
      const horario = reserva.horario_inicio;
      frequenciaHorarios[horario] = (frequenciaHorarios[horario] || 0) + 1;
    });

    // Ordenar horários por frequência e pegar os 2 mais frequentes
    const horariosNobres = Object.entries(frequenciaHorarios)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => entry[0]);

    return horariosNobres;
  } catch (error) {
    console.error('Erro ao calcular horários nobres:', error);
    return [];
  }
};

// Função para criar uma reserva
exports.createBooking = async (req, res) => {
  try {
    const { 
      quadra_id, 
      data, 
      horario_inicio, 
      horario_fim, 
      esporte_id,
      metodo_pagamento_id  // Alterado de 'pagamento' para 'metodo_pagamento_id'
    } = req.body;

    // Verificar disponibilidade antes de criar a reserva
    const disponivel = await verificarDisponibilidade(
      quadra_id,
      data,
      horario_inicio,
      horario_fim
    );

    if (!disponivel) {
      return res.status(400).json({
        success: false,
        message: 'Horário não está mais disponível'
      });
    }

    // Validar se todos os campos necessários foram fornecidos
    if (!quadra_id || !data || !horario_inicio || !horario_fim || !esporte_id || !metodo_pagamento_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Buscar a quadra para calcular o preço
    const quadra = await Court.findById(quadra_id);
    if (!quadra) {
      return res.status(404).json({
        success: false,
        message: 'Quadra não encontrada'
      });
    }

    // Calcular o total
    const [inicioHora, inicioMinuto] = horario_inicio.split(':').map(Number);
    const [fimHora, fimMinuto] = horario_fim.split(':').map(Number);
    const duracaoHoras = fimHora - inicioHora + (fimMinuto - inicioMinuto) / 60;
    const total = duracaoHoras * quadra.preco_por_hora;

    // Criar a reserva
    const novaReserva = await Booking.create({
      usuario_id: req.user.id,
      quadra_id,
      data,
      horario_inicio,
      horario_fim,
      esporte: esporte_id,
      metodo_pagamento: metodo_pagamento_id,
      total,
      status: 'pendente'
    });

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      reserva: novaReserva
    });

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva',
      error: error.message
    });
  }
};

// Função para cancelar uma reserva
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; // ID da reserva a ser cancelada

    // Verificar se a reserva existe e pertence ao usuário
    const booking = await Booking.findOne({ _id: id, usuario_id: req.user.id });
    if (!booking) {
      console.log(`Reserva com ID ${id} não encontrada ou não pertence ao usuário.`);
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada ou não pertence ao usuário.',
      });
    }

    // Verificar se a reserva já está cancelada
    if (booking.status === 'cancelada') {
      console.log(`Reserva com ID ${id} já foi cancelada.`);
      return res.status(400).json({
        success: false,
        message: 'A reserva já foi cancelada.',
      });
    }

    // Verificar se a reserva já começou
    const now = Date.now(); // Timestamp atual em milissegundos

    // Extrair componentes de data e hora da reserva
    const bookingDateTime = new Date(booking.data);
    const [hour, minute] = booking.horario_inicio.split(':').map(Number);
    bookingDateTime.setHours(hour, minute, 0, 0);
    const bookingTimestamp = bookingDateTime.getTime();

    console.log(`Data atual (backend): ${new Date(now).toISOString()}`);
    console.log(`Data da reserva (backend): ${bookingDateTime.toISOString()}`);

    if (now >= bookingTimestamp) {
      console.log(`Não é possível cancelar uma reserva que já começou. (now: ${new Date(now).toISOString()} >= bookingDateTime: ${bookingDateTime.toISOString()})`);
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar uma reserva que já começou.',
      });
    }

    // Atualizar o status da reserva para 'cancelada'
    booking.status = 'cancelada';
    await booking.save();

    console.log(`Reserva com ID ${id} foi cancelada com sucesso.`);

    res.status(200).json({
      success: true,
      message: 'Reserva cancelada com sucesso.',
      reserva: booking,
    });
  } catch (err) {
    console.error('Erro ao cancelar reserva:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar reserva.',
    });
  }
};

// Função para obter horários reservados para uma quadra em uma data específica
exports.getReservedTimes = async (req, res) => {
  try {
    const { quadraId } = req.params;
    const { data } = req.query;

    // Verificar se a quadra existe
    const quadra = await Court.findById(quadraId);
    if (!quadra) {
      return res.status(404).json({
        success: false,
        message: 'Quadra não encontrada.'
      });
    }

    const dia = data || new Date().toISOString().split('T')[0];
    
    // Calcular horários nobres
    const horariosNobres = await calcularHorariosNobres(quadraId, new Date(dia));
    console.log('Horários nobres calculados:', horariosNobres);

    // Buscar reservas do dia
    const reservas = await Booking.find({
      quadra_id: quadraId,
      data: dia,
      status: { $ne: 'cancelada' }
    });

    console.log('Reservas encontradas:', reservas);

    const horariosAgendados = reservas.map(reserva => ({
      inicio: reserva.horario_inicio,
      fim: reserva.horario_fim,
      status: reserva.status
    }));

    res.status(200).json({
      success: true,
      quadra_id: quadraId,
      data: dia,
      horarios_agendados: horariosAgendados,
      horarios_nobres: horariosNobres // Incluindo na resposta
    });
  } catch (err) {
    console.error('Erro ao buscar horários:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar horários.'
    });
  }
};

// Função para obter detalhes de uma reserva específica
exports.getBookingById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }

  try {
    // Adicionar .populate('metodo_pagamento') para trazer os dados do método de pagamento
    const booking = await Booking.findById(id)
      .populate('quadra_id')
      .populate('esporte')
      .populate('usuario_id', 'nome')
      .populate('metodo_pagamento');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada.',
      });
    }

    if (!booking.usuario_id.equals(req.user.id)) {
      console.log(`Usuário ${req.user.id} não tem permissão para acessar a reserva ${id}.`);
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    // Estruturar os dados da reserva incluindo o label do método de pagamento
    const reservationData = {
      reservationId: booking._id,
      quadra_id: booking.quadra_id._id,
      nome: booking.quadra_id.nome,
      foto_principal: booking.quadra_id.foto_principal,
      data: booking.data.toISOString().split('T')[0],
      horario_inicio: booking.horario_inicio,
      horario_fim: booking.horario_fim,
      esporte: booking.esporte.nome,
      cliente: booking.usuario_id.nome,
      pagamento: booking.metodo_pagamento?.label || 'Não especificado',
      total: booking.total,
      status: booking.status,
    };

    console.log('Booking completo:', booking);
    console.log('Método de pagamento:', booking.metodo_pagamento);

    res.status(200).json({
      success: true,
      reservation: reservationData,
    });
  } catch (err) {
    console.error('Erro ao buscar reserva:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
};

// Função para obter todas as reservas do usuário autenticado
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Obtido pelo authMiddleware

    // Buscar todas as reservas onde usuario_id é igual ao ID do usuário autenticado
    const reservas = await Booking.find({ usuario_id: userId })
      .populate('quadra_id')
      .populate('esporte')
      .sort({ data: -1 }); // Ordenar por data descendente (opcional)

    res.status(200).json({
      success: true,
      reservas,
    });
  } catch (error) {
    console.error('Erro ao buscar reservas do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
};