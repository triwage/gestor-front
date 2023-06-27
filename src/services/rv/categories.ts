import { RVCategoriesProps } from '../../@types/rv/categories'
import { alerta } from '../../components/System/Alert'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useRVCategories() {
  return useQuery({
    queryKey: ['RVCategories'],
    queryFn: async (): Promise<RVCategoriesProps[] | null> => {
      try {
        const res = await api.get('/rv/categories')

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

export async function updateRVCategories(data: RVCategoriesProps) {
  try {
    const payload = {
      pcrv_id: data.pcrv_id,
      pcrv_kind: data.pcrv_kind,
    }

    const res = await api.put('/rv/categories', payload)

    const { success } = res.data

    if (success) {
      alerta('Categoria alterada com sucesso', 1)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}
