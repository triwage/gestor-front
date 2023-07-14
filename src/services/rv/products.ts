import { alerta } from '../../components/System/Alert'

import { RVProductsProps } from '../../@types/rv/products'

import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

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
      prrv_valor: data.prrv_valor ? formataMoedaPFloat(data.prrv_valor) : null,
      prrv_valor_minimo: data.prrv_valor_minimo
        ? formataMoedaPFloat(data.prrv_valor_minimo)
        : null,
      prrv_valor_maximo: data.prrv_valor_maximo
        ? formataMoedaPFloat(data.prrv_valor_maximo)
        : null,
      prrv_area_codes: data.prrv_area_codes,
      prrv_ativo: data.prrv_ativo,
    }

    const res = await api.put('/rv/products', payload)

    const { success, data: resData } = res.data

    if (success && haveData(resData)) {
      return haveData(resData)
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
