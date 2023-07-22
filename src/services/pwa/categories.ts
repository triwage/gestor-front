import { alerta } from '../../components/System/Alert'

import {
  PWAAddProductsCategoriesProps,
  PWACategoriesProps,
  ProvidesInCategories,
} from '../../@types/pwa/categories'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function usePWACategories() {
  return useQuery({
    queryKey: ['PWACategories'],
    queryFn: ListCategoriesPWA,
  })
}

export async function ListCategoriesPWA(): Promise<
  PWACategoriesProps[] | null
> {
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
}

export function usePWACategoriesOfProviders(id: number) {
  return useQuery({
    queryKey: ['PWACategiesOfProviders'],
    queryFn: async (): Promise<ProvidesInCategories[] | null> => {
      try {
        if (!id) {
          return null
        }
        const res = await api.get(
          `pwa/providers-prod-categories/product-category/${id}`,
        )

        const { success, data } = res.data

        if (success && haveData(data)) {
          return data[0].fornecedores
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

export async function addPWACategories(data: PWACategoriesProps) {
  try {
    const payload = {
      pcpw_cash_id: data.pcpw_cash_id,
      pcpw_descricao: data.pcpw_descricao,
      pcpw_imagem: data.pcpw_imagem ?? 'Sem imagem',
      pcpw_ativo: data.pcpw_ativo,
    }

    const res = await api.post('/pwa/products-categories', payload)

    const { success, data: resData } = res.data

    if (success && haveData(resData)) {
      return resData
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
    return null
  }
}

export async function updatePWACategory(data: PWACategoriesProps) {
  try {
    const payload = {
      pcpw_cash_id: data.pcpw_cash_id,
      pcpw_descricao: data.pcpw_descricao,
      pcpw_imagem: data.pcpw_imagem ?? '-',
      pcpw_ativo: data.pcpw_ativo,
    }

    const res = await api.put(
      `/pwa/products-categories/${data.pcpw_id}`,
      payload,
    )

    const { success, data: resData } = res.data

    if (success && haveData(resData)) {
      return resData
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
    return null
  }
}

export async function deletePwaCategory(id: number) {
  try {
    const res = await api.delete(`/pwa/products-categories/${id}`)

    const { success } = res.data

    if (success) {
      alerta('Categoria removida com sucesso', 1)
      return true
    } else {
      alerta('Não foi possível remover essa categoria')
      return false
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
    return false
  }
}

export async function addCategoriesInProvider({
  prpc_pcpw_id: categoryId,
  fopc_fopw_id: providerId,
}: PWAAddProductsCategoriesProps) {
  try {
    const payload = {
      fopc_pcpw_id: categoryId,
      fopc_fopw_id: providerId,
    }

    const res = await api.post('/pwa/providers-prod-categories', payload)

    const { success, error } = res.data

    if (!success) {
      alerta(clearCharacters(error))
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}

export async function removeCategoriesInProvider(id: number) {
  try {
    const res = await api.delete(`/pwa/providers-prod-categories/${id}`)

    const { success, error } = res.data

    if (!success) {
      alerta(clearCharacters(error))
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
