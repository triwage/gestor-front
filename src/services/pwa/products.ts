import { alerta } from '../../components/System/Alert'

import {
  Categoryes,
  PWAProductsCategoriesProps,
  PWAProductsProps,
} from '../../@types/pwa/products'

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

export function usePWACategoriesOfProdutos(id: number) {
  return useQuery({
    queryKey: ['PWACategoriesOfProducts'],
    queryFn: () => ListPWACategoriesOfProducts(id),
    cacheTime: Infinity,
  })
}

export async function ListPWACategoriesOfProducts(
  id: number,
): Promise<Categoryes[] | null> {
  try {
    if (!id) {
      return null
    }
    const res = await api.get(`/pwa/products-prod-categories/product/${id}`)
    const { data } = res.data

    if (haveData(data)) {
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
}

export async function addPWAProduct(data: PWAProductsProps) {
  try {
    const payload = {
      prpw_prrv_id: data.prpw_prrv_id ?? null,
      prpw_max_id: data.prpw_max_id ?? null,
      prpw_cash_id: data.prpw_cash_id ?? null,
      cash_descricao: data.cash_descricao ?? null,
      prpw_pcpw_id: data.prpw_pcpw_id ?? null,
      pcpw_descricao: data.pcpw_descricao ?? null,
      prpw_fopw_id: data.prpw_fopw_id ?? null,
      fopw_descricao: data.fopw_descricao ?? null,
      prpw_descricao: data.prpw_descricao ?? null,
      prpw_imagem: data.prpw_imagem || 'não nula',
      prpw_valor: data.prpw_valor ? formataMoedaPFloat(data.prpw_valor) : null,
      prpw_ativo: data.prpw_ativo ?? false,
    }

    const res = await api.post('/pwa/products/', payload)

    const { success, data: dataRes } = res.data

    if (success) {
      return haveData(dataRes)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updatePWAProduct(data: PWAProductsProps) {
  try {
    const payload = {
      prpw_prrv_id: data.prpw_prrv_id,
      prpw_max_id: data.prpw_max_id ?? null,
      prpw_cash_id: data.prpw_cash_id ?? null,
      cash_descricao: data.cash_descricao ?? null,
      prpw_pcpw_id: data.prpw_pcpw_id ?? null,
      pcpw_descricao: data.pcpw_descricao ?? null,
      prpw_fopw_id: data.prpw_fopw_id ?? null,
      fopw_descricao: data.fopw_descricao ?? null,
      prpw_descricao: data.prpw_descricao ?? null,
      prpw_imagem: data.prpw_imagem || 'não nula',
      prpw_valor: data.prpw_valor ? formataMoedaPFloat(data.prpw_valor) : null,
      prpw_ativo: data.prpw_ativo ?? false,
    }

    const res = await api.put(`/pwa/products/${data.prpw_id}`, payload)

    const { success, data: dataRes } = res.data

    if (success) {
      return haveData(dataRes)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addCategoriesInProduct({
  prpc_pcpw_id: categoryId,
  prpc_prpw_id: productId,
}: PWAProductsCategoriesProps) {
  try {
    const payload = {
      prpc_pcpw_id: categoryId,
      prpc_prpw_id: productId,
    }

    const res = await api.post('/pwa/products-prod-categories', payload)

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

export async function removeCategoriesInProduct(id: number) {
  try {
    const res = await api.post(`/pwa/products-prod-categories/${id}`)

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
