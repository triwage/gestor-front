import {
  addDays,
  addYears,
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatISO,
  getDay,
  isValid,
  subDays,
} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export function formatISOBr() {
  return formatISO(new Date())
}

export const formatDateTimeToBr = (
  date: any,
  parse = 'dd/MM/yyyy HH:mm:ss',
) => {
  if (date) {
    return format(new Date(date), parse, {
      locale: ptBR,
    })
  }
  return '-'
}

export function getCurrentDate(days = 0, type = 1) {
  if (type === 1) {
    return format(addDays(new Date(), days), 'yyyy/MM/dd', {
      locale: ptBR,
    })
  } else if (type === 0) {
    return format(subDays(new Date(), days), 'yyyy/MM/dd', {
      locale: ptBR,
    })
  }
}

export function addYearsDate(years = 0) {
  return format(addYears(new Date(), years), 'yyyy-MM-dd', {
    locale: ptBR,
  })
}

export function getCurrentTime(formato = 'HH:mm:ss') {
  return format(new Date(), formato, {
    locale: ptBR,
  })
}

export const isValidDate = function (data: Date) {
  if (!data) {
    return false
  }

  const _data = isValid(data)

  return _data
}

export const weekDay = (data: Date) => {
  const diaSemana = getDay(data)
  switch (diaSemana) {
    case 0:
      return 'Domingo'
    case 1:
      return 'Segunda'
    case 2:
      return 'Terça'
    case 3:
      return 'Quarta'
    case 4:
      return 'Quinta'
    case 5:
      return 'Sexta'
    case 6:
      return 'Sábado'
    default:
      return ''
  }
}

export const weekDayNumber = (data: Date) => {
  const diaSemana = getDay(data)
  return diaSemana
}

export const diffInMinutes = (dataHoraInicial: Date, dataHoraFinal: Date) => {
  return differenceInMinutes(dataHoraInicial, dataHoraFinal)
}

export const diffInSeconds = (dataHoraInicial: Date, dataHoraFinal: Date) => {
  return differenceInSeconds(dataHoraInicial, dataHoraFinal)
}
