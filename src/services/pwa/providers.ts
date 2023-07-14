import { alerta } from '../../components/System/Alert'

import { Category } from '../../@types/pwa/categories'
import { PWAProvidersProps } from '../../@types/pwa/providers'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function usePWAProviders() {
  return useQuery({
    queryKey: ['PWAProviders'],
    queryFn: async (): Promise<PWAProvidersProps[] | null> => {
      try {
        const res = await api.get('/pwa/providers')
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

export function usePWAProvidersOfCategories(id: number) {
  return useQuery({
    queryKey: ['PWAProvidersOfCategories'],
    queryFn: async (): Promise<Category[] | null> => {
      try {
        if (!id) {
          return null
        }
        const res = await api.get(
          `/pwa/providers-prod-categories/provider/${id}`,
        )

        const { success, data } = res.data

        if (success && haveData(data)) {
          return data[0].categorias
        }
        return null
      } catch (error) {
        if (error instanceof AxiosError) {
          alerta(clearCharacters(error.response?.data?.error))
        } else {
          console.error(error)
        }
        return null
      }
    },
    cacheTime: Infinity,
  })
}

export async function addPWAProviders(data: PWAProvidersProps) {
  try {
    const payload = {
      fopw_forv_id: data.fopw_forv_id,
      fopw_cash_id: data.fopw_cash_id,
      fopw_nome: data.fopw_nome,
      fopw_descricao: data.fopw_descricao,
      fopw_termos_condicoes: data.fopw_termos_condicoes,
      fopw_instrucoes: data.fopw_instrucoes,
      fopw_imagem: data.fopw_imagem ?? 'Sem imagem',
      fopw_ativo: data.fopw_ativo,
    }

    const res = await api.post('/pwa/providers', payload)

    const { success, data: resData } = res.data

    if (success && haveData(resData)) {
      return resData
    }
  } catch (error) {
    console.error(error)
  }
}

export async function updatePWAProviders(data: PWAProvidersProps) {
  try {
    const payload = {
      fopw_forv_id: data.fopw_forv_id,
      fopw_cash_id: data.fopw_cash_id,
      fopw_nome: data.fopw_nome,
      fopw_descricao: data.fopw_descricao,
      fopw_termos_condicoes: data.fopw_termos_condicoes,
      fopw_instrucoes: data.fopw_instrucoes,
      fopw_imagem: data.fopw_imagem,
      fopw_ativo: data.fopw_ativo,
    }

    const res = await api.put(`/pwa/providers/${data.fopw_id}`, payload)

    const { success, data: resData } = res.data

    if (success && haveData(resData)) {
      return resData
    }
  } catch (error) {
    console.error(error)
  }
}
