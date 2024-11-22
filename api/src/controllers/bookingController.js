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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Função auxiliar para gerar datas recorrentes
const gerarDatasRecorrentes = (dataInicial, duracaoMeses, diaSemana) => {
  console.log('Gerando datas recorrentes:', {
    dataInicial,
    duracaoMeses,
    diaSemana
  });

  const datas = [];
  const dataInicio = new Date(dataInicial);
  const dataFim = new Date(dataInicial);
  dataFim.setMonth(dataFim.getMonth() + parseInt(duracaoMeses));

  // Ajustar para o primeiro dia do mês seguinte
  dataFim.setDate(1);
  dataFim.setMonth(dataFim.getMonth() + 1);
  dataFim.setDate(dataFim.getDate() - 1);

  let dataAtual = new Date(dataInicio);
  
  while (dataAtual <= dataFim) {
    if (dataAtual.getDay() === parseInt(diaSemana)) {
      datas.push(new Date(dataAtual));
    }
    // Avançar um dia
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  console.log(`Geradas ${datas.length} datas para recorrência:`, 
    datas.map(d => ({
      data: d.toISOString(),
      dia_semana: d.getDay()
    }))
  );

  return datas;
};

// Função auxiliar para verificar disponibilidade
const verificarDisponibilidade = async (quadra_id, data, horario_inicio, horario_fim) => {
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
    console.log('Controller - Dados recebidos:', req.body);
    
    const {
      quadra_id,
      data,
      horario_inicio,
      horario_fim,
      esporte_id,
      metodo_pagamento_id,
      total,
      pague_no_local,
      is_recorrente,
      recorrencia
    } = req.body;

    if (is_recorrente && recorrencia) {
      console.log('Controller - Dados da recorrência:', {
        duracao_meses: recorrencia.duracao_meses,
        tipo: typeof recorrencia.duracao_meses
      });
      
      const duracaoMeses = Number(recorrencia.duracao_meses);
      console.log('Controller - Duração em meses convertida:', duracaoMeses);

      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setMonth(dataFim.getMonth() + duracaoMeses);

      const datas = gerarDatasRecorrentes(
        dataInicio,
        duracaoMeses,
        recorrencia.dia_semana
      );

      console.log('Controller - Datas geradas:', {
        quantidade: datas.length,
        duracaoMeses,
        primeira: datas[0],
        ultima: datas[datas.length - 1]
      });

      // Criar a reserva principal (pai)
      const reservaPai = new Booking({
        usuario_id: req.user._id,
        quadra_id,
        data: dataInicio,
        horario_inicio,
        horario_fim,
        esporte: esporte_id,
        metodo_pagamento: metodo_pagamento_id,
        total,
        pague_no_local,
        is_recorrente: true,
        recorrencia: {
          duracao_meses: duracaoMeses,
          dia_semana: recorrencia.dia_semana,
          data_inicio: dataInicio,
          data_fim: dataFim,
          horarios: datas.map(data => ({
            data,
            horario_inicio,
            horario_fim,
            valor: total
          }))
        }
      });

      const reservaPaiSalva = await reservaPai.save();
      console.log('Reserva pai salva:', reservaPaiSalva);

      // Criar as reservas filhas
      const reservasFilhas = await Promise.all(datas.slice(1).map(async (dataRecorrencia) => {
        const reservaFilha = new Booking({
          usuario_id: req.user._id,
          quadra_id,
          data: dataRecorrencia,
          horario_inicio,
          horario_fim,
          esporte: esporte_id,
          metodo_pagamento: metodo_pagamento_id,
          status: 'pendente',
          total: req.body.total,
          pague_no_local: req.body.pague_no_local || false,
          is_recorrente: true,
          recorrencia_pai_id: reservaPaiSalva._id,
          recorrencia: {
            duracao_meses: recorrencia.duracao_meses,
            dia_semana: recorrencia.dia_semana,
            data_inicio: dataInicio,
            data_fim: dataFim
          }
        });

        return reservaFilha.save();
      }));

      return res.status(201).json({
        success: true,
        message: 'Reservas recorrentes criadas com sucesso',
        data: {
          reserva_pai: reservaPaiSalva,
          reservas_filhas: reservasFilhas,
          total_reservas: reservasFilhas.length + 1
        }
      });
    }

    // Verificar se já existe uma reserva para este horário
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const reservaExistente = await Booking.findOne({
      quadra_id,
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      horario_inicio,
      horario_fim,
      status: { $ne: 'cancelada' } // Não considerar reservas canceladas
    });

    if (reservaExistente) {
      return res.status(409).json({
        success: false,
        message: 'Este horário já está reservado para esta data.',
        conflito: {
          data: reservaExistente.data,
          horario: `${reservaExistente.horario_inicio} - ${reservaExistente.horario_fim}`
        }
      });
    }

    // Validar se a quadra existe
    const quadra = await Court.findById(quadra_id);
    if (!quadra) {
      return res.status(404).json({
        success: false,
        message: 'Quadra não encontrada'
      });
    }

    // Buscar configurações de negócio para valores
    const businessConfig = await BusinessConfig.findOne();
    if (!businessConfig) {
      return res.status(500).json({
        success: false,
        message: 'Configurações de negócio não encontradas'
      });
    }

    // Verificar disponibilidade
    const horario = parseInt(horario_inicio.split(':')[0]);
    const isHorarioNobre = horario >= 18 && horario < 22;
    const valor = isHorarioNobre ? businessConfig.valor_hora_nobre : businessConfig.valor_hora_padrao;

    // Criar a reserva base
    const novaReserva = new Booking({
      usuario_id: req.user._id,
      quadra_id,
      data: new Date(data),
      horario_inicio,
      horario_fim,
      esporte: esporte_id,
      metodo_pagamento: metodo_pagamento_id,
      total: valor,
      is_recorrente: !!is_recorrente,
      status: 'pendente'
    });

    // Se for recorrente, adicionar dados de recorrência
    if (is_recorrente && recorrencia) {
      novaReserva.recorrencia = {
        duracao_meses: recorrencia.duracao_meses,
        dia_semana: new Date(data).getDay(),
        data_inicio: new Date(data),
        data_fim: new Date(recorrencia.data_fim),
        horarios: recorrencia.horarios
      };
    }

    console.log('Nova reserva a ser criada:', novaReserva);

    await novaReserva.save();

    return res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      data: {
        _id: novaReserva._id,
        // ... outros dados da reserva ...
      }
    });

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    console.log('Horários nobres:', horariosNobres);

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
    console.log('ID inválido:', id);
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

exports.checkRecorrencia = async (req, res) => {
  try {
    const { quadra_id, data, horario_inicio, horario_fim } = req.body;

    // Validação dos dados de entrada
    if (!quadra_id || !data || !horario_inicio || !horario_fim) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para verificação',
        required: ['quadra_id', 'data', 'horario_inicio', 'horario_fim']
      });
    }

    // Verificar se existe conflito para este horário
    const conflito = await BookingService.verificarConflitos(
      quadra_id,
      data,
      horario_inicio,
      horario_fim
    );

    return res.status(200).json({
      success: true,
      disponivel: !conflito,
      data: data,
      horario: {
        inicio: horario_inicio,
        fim: horario_fim
      }
    });

  } catch (error) {
    console.error('Erro ao verificar recorrência:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar disponibilidade do horário',
      error: error.message
    });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { quadra_id, data } = req.query;
    
    if (!quadra_id || !data) {
      return res.status(400).json({
        success: false,
        message: 'Quadra ID e data são obrigatórios'
      });
    }

    // Buscar configurações de negócio
    const businessConfig = await BusinessConfig.findOne();
    if (!businessConfig) {
      return res.status(404).json({
        success: false,
        message: 'Configurações de negócio não encontradas'
      });
    }

    // Gerar slots de horário
    const horariosNobres = await calcularHorariosNobres(quadra_id, new Date(data));
    const slots = await generateTimeSlots(
      quadra_id,
      new Date(data),
      businessConfig.horario_abertura,
      businessConfig.horario_fechamento,
      horariosNobres
    );

    res.status(200).json({
      success: true,
      slots: slots
    });

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
    
    console.log('1. Iniciando checkTimeSlots:', { quadra_id, data });

    // Buscar a quadra e as configurações de negócio em paralelo
    const [quadra, businessConfig] = await Promise.all([
      Court.findById(quadra_id),
      BusinessConfig.findOne()
    ]);

    if (!quadra) {
      return res.status(404).json({
        success: false,
        message: 'Quadra não encontrada'
      });
    }

    if (!businessConfig) {
      return res.status(500).json({
        success: false,
        message: 'Configurações de negócio não encontradas'
      });
    }

    // Buscar agendamentos do dia
    const dataInicio = dayjs(data).startOf('day').toDate();
    const dataFim = dayjs(data).endOf('day').toDate();

    const agendamentos = await Booking.find({
      quadra_id, // Corrigido de quadra para quadra_id
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      status: { $ne: 'cancelada' }
    });

    console.log('3. Agendamentos encontrados:', agendamentos.length);

    // Gerar slots usando horário do BusinessConfig
    const slots = BookingService.checkAvailability(
      {
        inicio: businessConfig.horario_abertura,
        fim: businessConfig.horario_fechamento
      },
      agendamentos,
      data,
      {
        valor_hora_padrao: businessConfig.valor_hora_padrao,
        valor_hora_nobre: businessConfig.valor_hora_nobre,
        percentual_hora_nobre: businessConfig.percentual_hora_nobre
      }
    );

    return res.status(200).json({
      success: true,
      slots,
      metadata: {
        quadra_id,
        quadra_nome: quadra.nome,
        data: dayjs(data).format('YYYY-MM-DD'),
        total_slots: slots.length,
        horario_funcionamento: {
          inicio: businessConfig.horario_abertura,
          fim: businessConfig.horario_fechamento
        }
      }
    });

  } catch (error) {
    console.error('Erro ao verificar slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar slots de horário',
      error: error.message
    });
  }
}; 

exports.getBooking = async (req, res) => {
  try {
    console.log('1. ID da reserva:', req.params.id);

    const booking = await Booking.findById(req.params.id)
      .populate('usuario_id', 'nome email telefone') // Garantir que o populate está correto
      .populate('quadra_id')
      .populate('esporte_id');

    console.log('2. Reserva encontrada:', booking);
    console.log('3. Dados do usuário:', booking.usuario_id); // Verificar se o usuário está sendo populado

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    // Formatar os dados da reserva
    const formattedBooking = {
      ...booking.toObject(),
      cliente_nome: booking.usuario_id?.nome,
      cliente_email: booking.usuario_id?.email,
      cliente_telefone: booking.usuario_id?.telefone
    };

    console.log('4. Dados formatados:', {
      usuario_id: booking.usuario_id,
      cliente_nome: formattedBooking.cliente_nome
    });

    res.status(200).json({
      success: true,
      reservation: formattedBooking
    });

  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
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