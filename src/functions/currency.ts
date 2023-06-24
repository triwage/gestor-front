export function FormataValorMonetario(valor: any, usarCifrao = true) {
  const val = valor || '0'
  let valorFormatado = parseFloat(String(val)).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
  if (!usarCifrao) {
    valorFormatado = valorFormatado.replace('R$', '').trimStart()
  }

  return valorFormatado
}

export function formatarMoeda(valor = '') {
  let v = String(valor).replace(/\D/g, '')

  v = (Number(v) / 100).toFixed(2).toString()

  v = v.replace('.', ',')

  v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,')

  v = v.replace(/(\d)(\d{3}),/g, '$1.$2,')
  return v
}

export function remVirgulaNum(str: any) {
  let valor = String(str)
  valor = valor.replace(/(,)/g, '.')

  const qtdePontosDoValor = String(valor).match(/(['.'])/g)?.length

  if (qtdePontosDoValor && qtdePontosDoValor > 1) {
    for (let i = 1; i < qtdePontosDoValor; i++) {
      valor = valor.replace('.', '')
    }
  }

  return valor
}

export function formataMoedaPFloat(valor: any, n = 2) {
  if (
    !isNaN(Number(valor)) &&
    typeof Number(valor) === 'number' &&
    Number(valor) % 1 !== 0
  ) {
    return Number(Number(valor).toFixed(2))
  }
  if (typeof valor === 'number' && valor % 2 !== 0 && valor % 2 !== 1) {
    return valor
  }
  return toFloat(String(valor).replace('R$', '').replace(/[. ]+/g, ''), n)
}

export function toFloat(v: string | number, n = 2) {
  if (!v) {
    v = '0'
  }
  return typeof v === 'string' || isFloat(v)
    ? Number(parseFloat(remVirgulaNum(v)).toFixed(n))
    : v
}

export const isFloat = (valor: string | number) => {
  return String(valor).includes('.')
}
