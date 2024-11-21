class BookingService {
  static checkAvailability(horarioFuncionamento, agendamentos = [], data, config) {
    try {
      console.log('BookingService - Iniciando geração de slots:', {
        horarioFuncionamento,
        agendamentosCount: agendamentos.length,
        data,
        config
      });

      const slots = [];
      const [horaInicio] = horarioFuncionamento.inicio.split(':');
      const [horaFim] = horarioFuncionamento.fim.split(':');

      // Definir horário nobre (18:00 às 22:00)
      const HORARIO_NOBRE_INICIO = 18;
      const HORARIO_NOBRE_FIM = 22;

      for (let hora = parseInt(horaInicio); hora < parseInt(horaFim); hora++) {
        const horarioInicio = `${String(hora).padStart(2, '0')}:00`;
        const horarioFim = `${String(hora + 1).padStart(2, '0')}:00`;

        // Verificar se é horário nobre
        const isHorarioNobre = hora >= HORARIO_NOBRE_INICIO && hora < HORARIO_NOBRE_FIM;

        // Verificar se o horário está ocupado
        const ocupado = agendamentos.some(agendamento => 
          agendamento.horario_inicio === horarioInicio &&
          agendamento.horario_fim === horarioFim
        );

        slots.push({
          horario_inicio: horarioInicio,
          horario_fim: horarioFim,
          disponivel: !ocupado,
          available: !ocupado,
          horario_nobre: isHorarioNobre,
          valor: isHorarioNobre ? config.valor_hora_nobre : config.valor_hora_padrao,
          valor_hora_padrao: config.valor_hora_padrao,
          valor_hora_nobre: config.valor_hora_nobre
        });
      }

      console.log(`BookingService - ${slots.length} slots gerados`);
      return slots;

    } catch (error) {
      console.error('Erro em BookingService.checkAvailability:', error);
      throw error;
    }
  }

  static async verificarConflitos(quadraId, data, horarioInicio, horarioFim) {
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const reservasConflitantes = await Booking.find({
      quadra_id: quadraId,
      data: {
        $gte: dataInicio,
        $lte: dataFim
      },
      horario_inicio,
      horario_fim,
      status: { $ne: 'cancelada' }
    });

    return reservasConflitantes.length > 0;
  }
}

module.exports = BookingService; 