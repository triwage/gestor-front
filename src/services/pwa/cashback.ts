import { alerta } from '../../components/System/Alert'

import { PWACashbackProps } from '../../@types/pwa/cashback'

import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function usePWACashback() {
  return useQuery({
    queryKey: ['PWACashback'],
    queryFn: ListCashback,
  })
}

export async function ListCashback(): Promise<PWACashbackProps[] | null> {
  try {
    const res = await api.get('/pwa/cashbacks')
    const { data } = res.data

    return haveData(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
    return null
  }
}

export async function addPWACashback(data: PWACashbackProps) {
  try {
    const payload = {
      cash_descricao: data.cash_descricao,
      cash_valor: data.cash_valor ? formataMoedaPFloat(data.cash_valor) : null,
      cash_ativo: data.cash_ativo,
    }

    const res = await api.post('/pwa/cashbacks', payload)

    const { success } = res.data

    if (success) {
      alerta('Cashback criado com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/cashback'
      }, 400)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}

export async function updatePWACashback(data: PWACashbackProps) {
  try {
    const payload = {
      cash_descricao: data.cash_descricao,
      cash_valor: data.cash_valor ? formataMoedaPFloat(data.cash_valor) : null,
      cash_ativo: data.cash_ativo,
      cash_id: data.cash_id,
    }

    const res = await api.put(`/pwa/cashbacks/${data.cash_id}`, payload)

    const { success } = res.data

    if (success) {
      alerta('Cashback alterada com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/cashback'
      }, 400)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
