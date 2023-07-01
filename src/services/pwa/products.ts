import { alerta } from '../../components/System/Alert'

import { PWAProductsProps } from '../../@types/pwa/products'

import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function usePWAProducts() {
  return useQuery({
    queryKey: ['PWAProducts'],
    queryFn: async (): Promise<PWAProductsProps[] | null> => {
      try {
        const res = await api.get('/pwa/products')
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
    },
  })
}

export async function addPWAProduct(data: PWAProductsProps) {
  try {
    const payload = {
      prpw_prrv_id: data.prpw_prrv_id,
      prpw_max_id: data.prpw_max_id,
      prpw_cash_id: data.prpw_cash_id,
      cash_descricao: data.cash_descricao,
      prpw_pcpw_id: data.prpw_pcpw_id,
      pcpw_descricao: data.pcpw_descricao,
      prpw_fopw_id: data.prpw_fopw_id,
      fopw_descricao: data.fopw_descricao,
      prpw_descricao: data.prpw_descricao,
      prpw_imagem: data.prpw_imagem || 'não nula',
      prpw_valor: data.prpw_valor ? formataMoedaPFloat(data.prpw_valor) : null,
      prpw_ativo: data.prpw_ativo,
    }

    const res = await api.post('/pwa/products/', payload)

    const { success } = res.data

    if (success) {
      alerta('Produto adicionado com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/produtos'
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

export async function updatePWAProduct(data: PWAProductsProps) {
  try {
    const payload = {
      prpw_prrv_id: data.prpw_prrv_id,
      prpw_max_id: data.prpw_max_id,
      prpw_cash_id: data.prpw_cash_id,
      cash_descricao: data.cash_descricao,
      prpw_pcpw_id: data.prpw_pcpw_id,
      pcpw_descricao: data.pcpw_descricao,
      prpw_fopw_id: data.prpw_fopw_id,
      fopw_descricao: data.fopw_descricao,
      prpw_descricao: data.prpw_descricao,
      prpw_imagem: data.prpw_imagem,
      prpw_valor: data.prpw_valor ? formataMoedaPFloat(data.prpw_valor) : null,
      prpw_ativo: data.prpw_ativo,
    }

    const res = await api.put(`/pwa/products/${data.prpw_id}`, payload)

    const { success } = res.data

    if (success) {
      alerta('Produto alterado com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/produtos'
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
