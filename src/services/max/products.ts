import { alerta } from '../../components/System/Alert'

import { useMaxProductsStore } from '../../store/useMaxProductsStore'

import { MaxProductsProps } from '../../@types/max/products'

import useLoading from '../../contexts/LoadingContext'
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
      descricao: data.descricao,
      imagem_padrao_url: data.imagem_padrao_url,
      preco: data.preco,
      status: data.status ? '1' : '0',
    }

    const res = await api.post('/maxnivel/products', payload)

    const { success } = res.data

    if (success) {
      alerta('Produto adicionado com sucesso', 1)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}

export async function updateMaxProduct(data: MaxProductsProps) {
  try {
    const payload = {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao,
      imagem_padrao_url: data.imagem_padrao_url,
      preco: data.preco,
      status: data.status,
    }

    const res = await api.put(`/maxnivel/products/${data.id}`, payload)

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
