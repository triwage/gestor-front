import { alerta } from '../../components/System/Alert'

import { PWACategoriesProps } from '../../@types/pwa/categories'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function usePWACategories() {
  return useQuery({
    queryKey: ['PWACategories'],
    queryFn: async (): Promise<PWACategoriesProps[] | null> => {
      try {
        const res = await api.get('/pwa/products-categories')
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

export async function addPWACategories(data: PWACategoriesProps) {
  try {
    const payload = {
      pcpw_prrv_id: data.pcpw_prrv_id,
      pcpw_cash_id: data.pcpw_cash_id,
      pcpw_descricao: data.pcpw_descricao,
      pcpw_imagem: data.pcpw_imagem ?? 'Sem imagem',
      pcpw_ativo: data.pcpw_ativo,
    }

    const res = await api.post('/pwa/products-categories', payload)

    const { success } = res.data

    if (success) {
      alerta('Categoria criada com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/categorias'
      }, 800)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}

export async function updatePWACategory(data: PWACategoriesProps) {
  try {
    const payload = {
      pcpw_prrv_id: data.pcpw_prrv_id,
      pcpw_cash_id: data.pcpw_cash_id,
      pcpw_descricao: data.pcpw_descricao,
      pcpw_imagem: data.pcpw_imagem,
      pcpw_ativo: data.pcpw_ativo,
    }

    const res = await api.put(
      `/pwa/products-categories/${data.pcpw_id}`,
      payload,
    )

    const { success } = res.data

    if (success) {
      alerta('Categoria alterada com sucesso', 1)
      setTimeout(() => {
        location.href = '/pwa/categorias'
      }, 800)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
