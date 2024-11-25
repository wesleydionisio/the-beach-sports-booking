import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/pt-br'; // Importar localização PT-BR

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('pt-br'); // Definir localização

class DateService {
  // Para enviar para a API
  static toUTC(date) {
    return dayjs(date).format('YYYY-MM-DD');
  }

  // Para receber da API e converter para exibição
  static formatDisplay(utcDateString) {
    if (!utcDateString) return '';
    
    try {
      // Manter a data UTC e apenas formatar para exibição
      const date = dayjs(utcDateString);
      
      console.log('Conversão de data:', {
        original: utcDateString,
        date: date.format('YYYY-MM-DD'),
        formatado: date.format('DD [de] MMMM [de] YYYY')
      });
      
      // Formatar a data no formato desejado usando pt-br
      return date.format('DD [de] MMMM [de] YYYY');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  }

  // Para formatar horários
  static formatTime(time) {
    if (!time) return '';
    return dayjs(`2000-01-01 ${time}`).format('HH:mm');
  }

  // Para formatar intervalo de horário
  static formatTimeInterval(startTime, endTime) {
    return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
  }

  // Para verificar se é data passada
  static isPastDate(date) {
    return dayjs(date).isBefore(dayjs(), 'day');
  }

  // Para obter data atual em UTC
  static getCurrentDateUTC() {
    return dayjs().format('YYYY-MM-DD');
  }

  // Para debug de datas
  static debugDate(date) {
    const d = dayjs(date);
    return {
      original: date,
      formatted: d.format('YYYY-MM-DD'),
      utc: d.format(),
      timezone: dayjs.tz.guess()
    };
  }

  static calculateTimeToStart(date, startTime) {
    if (!date || !startTime) return null;
    
    try {
      const [hour, minute] = startTime.split(':');
      const reservationDateTime = dayjs(date)
        .hour(parseInt(hour))
        .minute(parseInt(minute))
        .second(0);
      
      const now = dayjs();
      
      if (reservationDateTime.isBefore(now)) {
        return { status: 'finished', text: 'FINALIZADO' };
      }

      const hoursRemaining = reservationDateTime.diff(now, 'hour');
      
      if (hoursRemaining < 24) {
        return { 
          status: 'hours', 
          value: hoursRemaining,
          text: `${hoursRemaining} HORAS`
        };
      } else {
        const daysRemaining = Math.floor(hoursRemaining / 24);
        return { 
          status: 'days', 
          value: daysRemaining,
          text: `${daysRemaining} DIAS`
        };
      }
    } catch (error) {
      console.error('Erro ao calcular tempo para início:', error);
      return null;
    }
  }
}

export default DateService;