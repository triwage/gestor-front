import { alerta } from '../../components/System/Alert'

import { useMaxProductsStore } from '../../store/useMaxProductsStore'

import { MaxProductsProps } from '../../@types/max/products'

import useLoading from '../../contexts/LoadingContext'
import { formataMoedaPFloat } from '../../functions/currency'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useMaxProducts() {
  const { setLoading } = useLoading()
  const { currentStatus } = useMaxProductsStore()
  return useQuery({
    queryKey: ['MaxProducts', currentStatus],
    queryFn: async (): Promise<MaxProductsProps[] | null> => {
      try {
        setLoading(true)
        let res = null
        if (currentStatus === -1) {
          res = await api.get('/maxnivel/products')
        } else {
          res = await api.get('/maxnivel/products', {
            params: {
              status: currentStatus,
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
      } finally {
        setLoading(false)
      }
    },
  })
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
      status: data.status,
    }

    const res = await api.put(`/maxnivel/products/${data.id}`, payload)

    const { success, data: resData } = res.data

    if (success) {
      return resData
    } else {
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
