const dayjs = require('dayjs');
const BookingService = require('./BookingService');

class RecurrenceService {
  static async generatePreview(params) {
    try {
      console.log('1. Iniciando generatePreview com params:', params);
      const {
        dataBase,
        duracaoDias,
        tipoRecorrencia,
        diasSemana,
        quadraId,
        horarioInicio,
        horarioFim,
        esporte
      } = params;

      // Gerar datas
      const dataInicio = dayjs(dataBase);
      const dataFim = dataInicio.add(duracaoDias, 'day');
      const datas = [];
      let currentDate = dataInicio;

      console.log('2. Período de datas:', {
        inicio: dataInicio.format('YYYY-MM-DD'),
        fim: dataFim.format('YYYY-MM-DD')
      });

      // Gerar todas as datas possíveis
      while (currentDate.isBefore(dataFim)) {
        if (tipoRecorrencia === 'semanal' && diasSemana.includes(currentDate.day())) {
          console.log('Gerando data:', {
            data: currentDate.format('YYYY-MM-DD'),
            diaSemana: currentDate.day()
          });
          
          datas.push({
            data: currentDate.startOf('day').toISOString(),
            horario_inicio: horarioInicio,
            horario_fim: horarioFim
          });
        }
        currentDate = currentDate.add(1, 'day');
      }

      console.log('3. Datas geradas:', datas);

      // Verificar disponibilidade para cada data
      const disponibilidade = await Promise.all(
        datas.map(async (data) => {
          console.log('4. Verificando conflitos para:', {
            data: data.data,
            horario: `${data.horario_inicio}-${data.horario_fim}`
          });

          const conflito = await BookingService.verificarConflitos(
            quadraId,
            data.data,
            data.horario_inicio,
            data.horario_fim
          );

          console.log('5. Resultado da verificação:', {
            data: data.data,
            conflito: conflito ? 'Indisponível' : 'Disponível'
          });

          return {
            ...data,
            disponivel: !conflito
          };
        })
      );

      console.log('6. Preview final gerado:', {
        total: disponibilidade.length,
        disponiveis: disponibilidade.filter(d => d.disponivel).length,
        datas: disponibilidade
      });

      return {
        datas: disponibilidade,
        total: disponibilidade.length,
        disponiveis: disponibilidade.filter(d => d.disponivel).length
      };
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      throw error;
    }
  }
}

module.exports = RecurrenceService; 