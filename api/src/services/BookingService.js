const Booking = require('../models/Booking');
const dayjs = require('dayjs');

class BookingService {
  static checkAvailability(horarioFuncionamento, agendamentos = [], dataString, config) {
    try {
      const slots = [];
      const agora = new Date();
      
      const [ano, mes, dia] = dataString.split('-').map(Number);
      const dataAgendamento = new Date(ano, mes - 1, dia);
      
      const horaAbertura = parseInt(config.horario_abertura.split(':')[0]);
      const horaFechamento = parseInt(config.horario_fechamento.split(':')[0]);

      // Iterar sobre os horários
      for (let hora = horaAbertura; hora < horaFechamento; hora++) {
        const horaFormatada = `${String(hora).padStart(2, '0')}:00`;
        const horaFimFormatada = `${String(hora + 1).padStart(2, '0')}:00`;
        
        const horarioReservado = agendamentos.some(agendamento => 
          agendamento.horario_inicio === horaFormatada && 
          agendamento.status !== 'cancelada'
        );

        const isHorarioNobre = hora >= 18 && hora < 22;
        const valor = isHorarioNobre ? config.valor_hora_nobre : config.valor_hora_padrao;

        const slot = {
          horario_inicio: horaFormatada,
          horario_fim: horaFimFormatada,
          disponivel: !horarioReservado,
          is_horario_nobre: isHorarioNobre,
          valor: valor
        };

        slots.push(slot);
      }

      return slots;
    } catch (error) {
      console.error('ERRO em checkAvailability:', error);
      throw error;
    }
  }

  static isHorarioNobre(hora) {
    return hora >= 18 && hora < 22;
  }

  static hasConflict(agendamentos, hora) {
    return agendamentos.some(agendamento => {
      // Converter o horário de início da reserva para número
      const horaInicio = parseInt(agendamento.horario_inicio.split(':')[0]);
      const horaFim = parseInt(agendamento.horario_fim.split(':')[0]);
      
      console.log('Verificando conflito:', {
        hora,
        horaInicio,
        horaFim,
        agendamento: agendamento._id,
        status: agendamento.status
      });

      // Verificar se o horário está dentro do período da reserva
      // e se a reserva não está cancelada
      return hora >= horaInicio && 
             hora < horaFim && 
             agendamento.status !== 'cancelada';
    });
  }

  static async verificarConflitos(quadraId, data, horarioInicio, horarioFim) {
    try {
      // Converter a data para o início do dia (00:00:00)
      const dataObj = dayjs(data).startOf('day');
      
      console.log('1. Verificando conflitos para:', {
        quadraId,
        data: dataObj.format('YYYY-MM-DD'),
        horarioInicio,
        horarioFim,
        diaSemana: dataObj.day()
      });

      // Buscar todas as reservas do dia
      const reservas = await Booking.find({
        quadra_id: quadraId,
        data: {
          $gte: dataObj.toDate(),
          $lte: dataObj.endOf('day').toDate()
        },
        status: { $ne: 'cancelada' }
      });

      console.log('2. Reservas encontradas no dia:', reservas.map(r => ({
        id: r._id,
        data: dayjs(r.data).format('YYYY-MM-DD'),
        horario: `${r.horario_inicio}-${r.horario_fim}`
      })));

      // Verificar se há conflito de horário
      const temConflito = reservas.some(reserva => {
        const conflito = (
          horarioInicio === reserva.horario_inicio ||
          horarioFim === reserva.horario_fim ||
          (horarioInicio > reserva.horario_inicio && horarioInicio < reserva.horario_fim) ||
          (horarioFim > reserva.horario_inicio && horarioFim < reserva.horario_fim) ||
          (horarioInicio < reserva.horario_inicio && horarioFim > reserva.horario_fim)
        );

        if (conflito) {
          console.log('3. Conflito encontrado:', {
            novaReserva: `${horarioInicio}-${horarioFim}`,
            reservaExistente: `${reserva.horario_inicio}-${reserva.horario_fim}`
          });
        }

        return conflito;
      });

      console.log('4. Resultado final:', temConflito ? 'Indisponível' : 'Disponível');

      return temConflito;
    } catch (error) {
      console.error('Erro ao verificar conflitos:', error);
      throw error;
    }
  }
}

module.exports = BookingService; 