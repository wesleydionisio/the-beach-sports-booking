// src/controllers/bookingController.js

const mongoose = require('mongoose'); // **Adicionar esta linha**
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Sport = require('../models/Sport'); // Corrigido de Esporte para Sport
const User = require('../models/User'); // Adicionar importação do User se necessário
const Joi = require('joi');
const BusinessConfig = require('../models/BusinessConfig');
const BookingService = require('../services/BookingService');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const DateService = require('../utils/dateService');
const RecurrenceService = require('../services/RecurrenceService');
const MercadoPagoService = require('../services/MercadoPagoService');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Função auxiliar para verificar disponibilidade
const verificarDisponibilidade = async (quadra_id, data, horario_inicio, horario_fim) => {
  console.log('Verificando disponibilidade:', {
    quadra_id,
    data: new Date(data).toLocaleDateString(),
    horario_inicio,
    horario_fim
  });

  const reservaExistente = await Booking.findOne({
    quadra_id,
    data: {
      $gte: new Date(data).setHours(0,0,0,0),
      $lt: new Date(data).setHours(23,59,59,999)
    },
    horario_inicio,
    horario_fim,
    status: { $ne: 'cancelada' }
  }).populate('usuario_id', 'nome');

  if (reservaExistente) {
    console.log('Reserva existente encontrada:', {
      usuario: reservaExistente.usuario_id?.nome,
      data: new Date(reservaExistente.data).toLocaleDateString(),
      horario: `${reservaExistente.horario_inicio} - ${reservaExistente.horario_fim}`
    });
  }

  return {
    disponivel: !reservaExistente,
    reservaExistente
  };
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
    console.log('1. Dados recebidos para criação:', req.body);
    
    const {
      quadra_id,
      data,
      horario_inicio,
      horario_fim,
      esporte,
      metodo_pagamento,
      total
    } = req.body;

    // Validar total
    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'O valor total é obrigatório e deve ser maior que zero'
      });
    }

    // Converter a data para UTC
    const bookingDate = DateService.parseToUTC(data);
    
    console.log('2. Dados processados:', {
      quadra_id,
      data: bookingDate,
      horario_inicio,
      horario_fim,
      esporte,
      metodo_pagamento,
      total
    });

    const booking = new Booking({
      usuario_id: req.user.id,
      quadra_id,
      data: bookingDate,
      horario_inicio,
      horario_fim,
      esporte,
      metodo_pagamento,
      total,
      status: metodo_pagamento === 'pix' ? 'pendente' : 'confirmada'
    });

    await booking.save();
    
    console.log('3. Reserva criada com sucesso:', booking);

    // Se for PIX, gerar o QR Code
    if (metodo_pagamento === 'pix') {
      const pixData = await MercadoPagoService.createPixPayment({
        total,
        quadra_nome: booking.quadra_id.nome,
        usuario_email: req.user.email,
        documento_tipo: req.user.documento_tipo,
        documento_numero: req.user.documento_numero
      });

      // Atualizar a reserva com os dados do PIX
      booking.pagamento_dados = {
        pix_qr_code: pixData.qr_code,
        pix_qr_code_text: pixData.qr_code_text,
        payment_id: pixData.payment_id
      };
      await booking.save();
    }

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      booking
    });

  } catch (error) {
    console.error('4. Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva',
      error: error.message,
      details: error.errors // Adicionar detalhes do erro de validação
    });
  }
};

// Função para cancelar uma reserva
exports.cancelBooking = async (req, res) => {
  try {
    console.log('1. Iniciando cancelamento da reserva:', req.params.id);
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelada' },
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    console.log('2. Reserva cancelada:', updatedBooking);

    res.status(200).json({
      success: true,
      message: 'Reserva cancelada com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar reserva'
    });
  }
};

// Função para obter horários reservados para uma quadra em uma data específica
exports.getReservedTimes = async (req, res) => {
  try {
    const { quadraId } = req.params; // Mudando de id para quadraId para match com a rota
    const { data } = req.query;

    console.log('Parâmetros recebidos:', { quadraId, data });

    if (!quadraId) {
      throw new Error('ID da quadra não fornecido');
    }

    // Formatar a data corretamente para a busca
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    // Buscar configurações de negócio
    const config = await BusinessConfig.findOne();
    if (!config) {
      throw new Error('Configurações de negócio não encontradas');
    }

    // Buscar reservas existentes para a data
    const reservas = await Booking.find({ 
      quadra_id: quadraId, // Usando quadraId ao invés de id
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      status: { $ne: 'cancelada' }
    });

    console.log('Reservas encontradas:', reservas);

    // Calcular horários nobres
    const horariosNobres = await calcularHorariosNobres(quadraId, dataInicio);
    
    // Formatar os horários reservados
    const horariosReservados = reservas.map((reserva) => ({
      inicio: reserva.horario_inicio,
      fim: reserva.horario_fim
    }));

    console.log('Horários reservados formatados:', horariosReservados);
    console.log('Horrios nobres:', horariosNobres);

    res.status(200).json({ 
      horariosReservados,
      horariosNobres,
      config: {
        valor_hora_padrao: config.valor_hora_padrao,
        valor_hora_nobre: config.valor_hora_nobre,
        horario_abertura: config.horario_abertura,
        horario_fechamento: config.horario_fechamento
      }
    });
  } catch (err) {
    console.error('Erro ao buscar horários:', err);
    res.status(500).json({ 
      message: 'Erro ao buscar horários reservados.', 
      error: err.message 
    });
  }
};

// Função para obter detalhes de uma reserva específica
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  console.log('Buscando reserva com ID:', id);
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID invlido:', id);
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
    console.error('Erro detalhado:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
      error: err.message
    });
  }
};

// Função para buscar reservas do usuário
exports.getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 5, tipo = 'futuras' } = req.query;
    const skip = (page - 1) * limit;
    const now = new Date();
    
    let query = { usuario_id: req.user.id };
    
    // Se tipo for 'todas', não aplica filtro de data
    if (tipo !== 'todas') {
      const dateFilter = tipo === 'futuras' 
        ? { data: { $gte: now } }
        : { data: { $lt: now } };
      query = { ...query, ...dateFilter };
    }
    
    // Para paginação
    const reservas = await Booking.find(query)
      .sort(tipo === 'futuras' ? { data: 1 } : { data: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'quadra_id',
        select: 'nome foto_principal'
      })
      .populate('esporte', 'nome icon');

    // Para métricas - buscar todas as reservas sem paginação
    const todasReservas = await Booking.find({ usuario_id: req.user.id });
    
    // Calcular métricas
    const metricas = {
      totalRealizados: todasReservas.filter(r => r.status !== 'cancelada').length,
      totalFuturos: todasReservas.filter(r => {
        const dataReserva = new Date(r.data);
        const horaInicio = r.horario_inicio.split(':').map(Number);
        dataReserva.setHours(horaInicio[0], horaInicio[1], 0);
        return dataReserva > now && r.status !== 'cancelada';
      }).length,
      horasPraticadas: todasReservas.filter(r => {
        const dataReserva = new Date(r.data);
        const horaInicio = r.horario_inicio.split(':').map(Number);
        dataReserva.setHours(horaInicio[0], horaInicio[1], 0);
        return dataReserva <= now && r.status !== 'cancelada';
      }).length
    };

    // Para paginação
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      reservas,
      total,
      metricas,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reservas'
    });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { quadra_id, data, horario_inicio, horario_fim } = req.query;
    
    console.log('Verificando disponibilidade:', {
      quadra_id,
      data: new Date(data).toLocaleDateString(),
      horario_inicio,
      horario_fim
    });

    // Converter a data para o início e fim do dia
    const dataObj = new Date(data);
    const dataInicio = new Date(dataObj.setHours(0, 0, 0, 0));
    const dataFim = new Date(dataObj.setHours(23, 59, 59, 999));

    // Buscar reservas existentes
    const reservaExistente = await Booking.findOne({
      quadra_id,
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      horario_inicio,
      horario_fim,
      status: { $ne: 'cancelada' }
    }).populate('usuario_id', 'nome');

    const resultado = {
      disponivel: !reservaExistente,
      conflito: reservaExistente ? {
        id: reservaExistente._id,
        usuario: reservaExistente.usuario_id?.nome,
        horario: `${reservaExistente.horario_inicio} - ${reservaExistente.horario_fim}`
      } : null
    };

    console.log('Resultado da verificação:', resultado);

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar disponibilidade',
      error: error.message
    });
  }
};

// Função auxiliar para gerar slots de tempo
const generateTimeSlots = async (quadraId, data) => {
  const businessConfig = await BusinessConfig.findOne();
  if (!businessConfig) {
    throw new Error('Configurações de negócio não encontradas');
  }

  const slots = [];
  const horaAbertura = parseInt(businessConfig.horario_abertura.split(':')[0]);
  const horaFechamento = parseInt(businessConfig.horario_fechamento.split(':')[0]);

  for (let hora = horaAbertura; hora < horaFechamento; hora++) {
    const horarioInicio = `${hora.toString().padStart(2, '0')}:00`;
    const horarioFim = `${(hora + 1).toString().padStart(2, '0')}:00`;

    const disponibilidade = await BookingService.checkAvailability(
      quadraId,
      data,
      horarioInicio,
      horarioFim
    );

    slots.push({
      horario_inicio: horarioInicio,
      horario_fim: horarioFim,
      disponivel: disponibilidade.disponivel,
      valor: hora >= 18 && hora < 22 ? businessConfig.valor_hora_nobre : businessConfig.valor_hora_padrao
    });
  }

  return slots;
};

exports.checkTimeSlots = async (req, res) => {
  try {
    const { quadra_id, data } = req.query;
    
    console.log('1. Verificando slots para:', { quadra_id, data });

    const config = await BusinessConfig.findOne();
    if (!config) {
      throw new Error('Configurações do negócio não encontradas');
    }

    // Usar o DateService para obter os limites do dia
    const { dataInicio, dataFim } = DateService.getDayBoundaries(data);

    console.log('2. Período de busca:', {
      dataOriginal: data,
      inicio: dayjs(dataInicio).format('YYYY-MM-DD HH:mm:ss'),
      fim: dayjs(dataFim).format('YYYY-MM-DD HH:mm:ss')
    });

    // Buscar reservas usando os limites corretos
    const reservas = await Booking.find({
      quadra_id,
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      status: { $ne: 'cancelada' }
    });

    console.log('3. Reservas encontradas:', reservas.map(r => ({
      id: r._id,
      data: DateService.formatToLocal(r.data),
      horario: `${r.horario_inicio}-${r.horario_fim}`,
      status: r.status
    })));

    res.status(200).json({
      success: true,
      reservas: reservas.map(r => ({
        ...r.toObject(),
        data: DateService.formatToLocal(r.data)
      }))
    });

  } catch (error) {
    console.error('ERRO em checkTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar slots de horário',
      error: error.message
    });
  }
}; 

exports.getBooking = async (req, res) => {
  try {
    console.log('1. ID da reserva recebido:', req.params.id);

    // Buscar a reserva com todas as referências necessárias
    const booking = await Booking.findById(req.params.id)
      .populate('quadra_id')  // Popular toda a quadra
      .populate('esporte')    // Popular todo o esporte
      .lean();  // Converter para objeto JavaScript puro

    console.log('2. Reserva encontrada (raw):', booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    // Formatar os dados para o frontend
    const formattedReservation = {
      ...booking,
      quadra: {
        id: booking.quadra_id?._id,
        nome: booking.quadra_id?.nome,
        imagem_url: booking.quadra_id?.imagem_url
      },
      esporte: {
        id: booking.esporte?._id,
        nome: booking.esporte?.nome,
        icon: booking.esporte?.icon
      }
    };

    console.log('3. Dados formatados:', {
      quadra: formattedReservation.quadra,
      esporte: formattedReservation.esporte
    });

    res.status(200).json({
      success: true,
      reservation: formattedReservation
    });

  } catch (error) {
    console.error('ERRO ao buscar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reserva',
      error: error.message
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    console.log('1. Iniciando atualização da reserva:', {
      id: req.params.id,
      updates: req.body
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedBooking) {
      console.log('2. Reserva não encontrada');
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    console.log('3. Reserva atualizada com sucesso:', updatedBooking);

    res.status(200).json({
      success: true,
      message: 'Reserva atualizada com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('4. Erro ao atualizar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar reserva',
      error: error.message
    });
  }
};

exports.previewRecorrencia = async (req, res) => {
  try {
    console.log('Recebendo requisição de preview:', req.body);
    const {
      dataBase,
      duracaoDias,
      tipoRecorrencia,
      diasSemana,
      quadraId,
      horarioInicio,
      horarioFim,
      esporte
    } = req.body;

    // Validações detalhadas
    const camposFaltantes = [];
    if (!dataBase) camposFaltantes.push('dataBase');
    if (!quadraId) camposFaltantes.push('quadraId');
    if (!horarioInicio) camposFaltantes.push('horarioInicio');
    if (!horarioFim) camposFaltantes.push('horarioFim');
    if (!esporte) camposFaltantes.push('esporte');

    if (camposFaltantes.length > 0) {
      throw new Error(`Dados incompletos para gerar preview. Campos faltantes: ${camposFaltantes.join(', ')}`);
    }

    const preview = await RecurrenceService.generatePreview({
      dataBase,
      duracaoDias,
      tipoRecorrencia,
      diasSemana,
      quadraId,
      horarioInicio,
      horarioFim,
      esporte
    });

    res.json({
      success: true,
      preview
    });
  } catch (error) {
    console.error('Erro ao gerar preview:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.confirmarRecorrencia = async (req, res) => {
  try {
    console.log('Recebendo dados para confirmação:', req.body);
    
    const { 
      quadraId, 
      esporte, 
      horarioInicio, 
      horarioFim, 
      datasConfirmadas,
      valor,
      metodo_pagamento
    } = req.body;

    // Validações
    if (!quadraId || !esporte || !horarioInicio || !horarioFim || !datasConfirmadas || !metodo_pagamento) {
      console.error('Dados incompletos:', { 
        quadraId, 
        esporte, 
        horarioInicio, 
        horarioFim, 
        datasConfirmadas,
        metodo_pagamento 
      });
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para criar as reservas recorrentes'
      });
    }

    // Criar as reservas
    const agendamentos = await Promise.all(
      datasConfirmadas.map(async (data) => {
        const novaReserva = new Booking({
          usuario_id: req.user.id,
          quadra_id: quadraId,
          esporte: esporte,
          data: new Date(data.data),
          horario_inicio: horarioInicio,
          horario_fim: horarioFim,
          valor: valor,
          total: valor,
          metodo_pagamento: metodo_pagamento,
          status: 'confirmada'
        });

        return await novaReserva.save();
      })
    );

    console.log('Agendamentos criados:', agendamentos);

    res.json({
      success: true,
      message: 'Agendamentos recorrentes criados com sucesso',
      agendamentos
    });
  } catch (error) {
    console.error('Erro ao criar agendamentos recorrentes:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar agendamentos recorrentes'
    });
  }
};

// Função para visualização pública da reserva
exports.getBookingPublic = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'ID inválido.' 
    });
  }

  try {
    const booking = await Booking.findById(id)
      .populate('quadra_id')
      .populate('esporte')
      .populate('usuario_id', 'nome')
      .select('-metodo_pagamento -valor'); // Omitir dados sensíveis

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada.'
      });
    }

    const reservationData = {
      reservationId: booking._id,
      quadra_id: booking.quadra_id._id,
      nome: booking.quadra_id.nome,
      foto_principal: booking.quadra_id.foto_principal,
      data: booking.data,
      horario_inicio: booking.horario_inicio,
      horario_fim: booking.horario_fim,
      esporte: booking.esporte.nome,
      cliente: booking.usuario_id.nome,
      status: booking.status
    };

    res.status(200).json({
      success: true,
      reservation: reservationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reserva.'
    });
  }
};

// Novo endpoint para verificar status do pagamento
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reserva não encontrada' });
    }

    if (booking.pagamento_dados?.payment_id) {
      const status = await MercadoPagoService.checkPaymentStatus(booking.pagamento_dados.payment_id);
      
      if (status === 'approved') {
        booking.status = 'confirmada';
        await booking.save();
      }

      return res.json({ success: true, status });
    }

    res.json({ success: false, message: 'Pagamento não encontrado' });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};