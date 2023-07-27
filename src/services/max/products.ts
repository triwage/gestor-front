import { alerta } from '../../components/System/Alert'

import { useMaxProductsStore } from '../../store/useMaxProductsStore'

import { MaxProductsProps } from '../../@types/max/products'

import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useMaxProducts() {
  const { currentStatus } = useMaxProductsStore()
  return useQuery({
    queryKey: ['MaxProducts', currentStatus],
    queryFn: async () => await ListMaxProducts(currentStatus),
  })
}

export async function ListMaxProducts(
  currentStatus: number,
  idMax?: number,
): Promise<MaxProductsProps[] | null> {
  try {
    let res = null

    if (currentStatus === 1) {
      res = await api.get('/maxnivel/products', {
        params: {
          status: 1,
          id: idMax ?? 0,
        },
      })
    } else {
      const ids = [idMax]
      res = await api.get('/maxnivel/products', {
        params: {
          status: 0,
          id: JSON.stringify(ids),
        },
      })
    }

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

export async function ListMaxProduct(
  idMax?: number,
): Promise<MaxProductsProps[] | null> {
  try {
    const ids = [idMax]
    const res = await api.get('/maxnivel/products', {
      params: {
        status: 1,
        id: JSON.stringify(ids),
      },
    })

    const { data } = res.data

    return haveData(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    }
    return null
  }
}

export async function ListAllProductsInMax(): Promise<
  MaxProductsProps[] | null
> {
  try {
    const res = await api.get('/pwa/products/select/maxnivel')

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

export async function addMaxProduct(data: MaxProductsProps) {
  try {
    const payload = {
      nome: data.nome,
      descricao: data.descricao ?? '',
      imagem_padrao_url: data.imagem_padrao_url ?? '',
      preco: data.preco ? formataMoedaPFloat(data.preco) : null,
      status: data.status ? '1' : '0',
    }

    const res = await api.post('/maxnivel/products', payload)

    const { success, error, data: resData } = res.data

    if (success) {
      return resData
    } else {
      alerta(clearCharacters(error))
      return null
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

export async function updateMaxProduct(data: MaxProductsProps) {
  try {
    const payload = {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao ?? 'Sem descrição',
      imagem_padrao_url: data.imagem_padrao_url ?? '',
      preco: data.preco,
      status: data.status ? '1' : '0',
    }

    const res = await api.put(`/maxnivel/products/${data.id}`, payload)

    const { success, data: resData } = res.data

    if (success) {
      if (haveData(resData)) {
        return resData
      } else {
        return true
      }
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
