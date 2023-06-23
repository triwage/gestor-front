import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RVCategoriesProps } from '../../@types/rv/categories'
import { alerta } from '../../components/System/Alert'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'

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
