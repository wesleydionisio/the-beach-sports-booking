const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

class DateService {
  static parseToUTC(dateString) {
    const date = dayjs(dateString).startOf('day');
    console.log('Convertendo para UTC:', {
      entrada: dateString,
      saida: date.format('YYYY-MM-DD'),
      utc: date.toISOString()
    });
    return date.toDate();
  }

  static formatToLocal(date) {
    return dayjs(date).format('YYYY-MM-DD');
  }

  static getDayBoundaries(dateString) {
    const start = dayjs(dateString).startOf('day');
    const end = dayjs(dateString).endOf('day');

    console.log('Limites do dia:', {
      data: dateString,
      inicio: start.format('YYYY-MM-DD HH:mm:ss'),
      fim: end.format('YYYY-MM-DD HH:mm:ss')
    });

    return {
      dataInicio: start.toDate(),
      dataFim: end.toDate()
    };
  }
}

module.exports = DateService;