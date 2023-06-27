import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RVProductsProps } from '../../@types/rv/products'
import { alerta } from '../../components/System/Alert'
import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'

export function useRVProducts() {
  return useQuery({
    queryKey: ['RVProducts'],
    queryFn: async (): Promise<RVProductsProps[] | null> => {
      try {
        const res = await api.get('/rv/products')

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

export async function updateRVProduct(data: RVProductsProps) {
  try {
    const payload = {
      prrv_id: data.prrv_id,
      prrv_rv_id: data.prrv_rv_id,
      prrv_pcrv_id: data.prrv_pcrv_id,
      prrv_forv_id: data.prrv_forv_id,
      prrv_nome: data.prrv_nome,
      prrv_valor: formataMoedaPFloat(data.prrv_valor),
      prrv_valor_minimo: formataMoedaPFloat(data.prrv_valor_minimo),
      prrv_valor_maximo: formataMoedaPFloat(data.prrv_valor_maximo),
      prrv_area_codes: data.prrv_area_codes,
      prrv_ativo: data.prrv_ativo,
    }

    const res = await api.put('/rv/products', payload)

    const { success } = res.data

    if (success) {
      alerta('Produto alterado com sucesso', 1)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
