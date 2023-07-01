import { alerta } from '../../components/System/Alert'

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

    const { success } = res.data

    if (success) {
      alerta('Fornecedor adicionado com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/fornecedores'
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

    const { success } = res.data

    if (success) {
      alerta('Fornecedor alterado com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/fornecedores'
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
