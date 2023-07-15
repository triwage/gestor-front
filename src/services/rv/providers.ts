import { alerta } from '../../components/System/Alert'

import { RVProvidersProps } from '../../@types/rv/providers'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useRVProviders() {
  return useQuery({
    queryKey: ['RVProviders'],
    queryFn: ListProvidersRV,
  })
}

export async function ListProvidersRV(): Promise<RVProvidersProps[] | null> {
  try {
    const res = await api.get('/rv/providers')

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

export async function updateRVSupplier(data: RVProvidersProps) {
  try {
    const payload = {
      forv_id: data.forv_id,
      forv_provider: data.forv_provider,
      forv_descricao: data.forv_descricao,
      forv_termos_condicoes: data.forv_termos_condicoes,
      forv_instrucoes: data.forv_instrucoes,
      forv_logo: data.forv_logo,
      forv_pcrv_id: data.forv_pcrv_id,
      pcrv_kind: data.pcrv_kind,
    }

    const res = await api.put('/rv/providers', payload)

    const { success } = res.data

    if (success) {
      alerta('Fornecedor alterado com sucesso', 1)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
