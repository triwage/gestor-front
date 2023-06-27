import { alerta } from '../../components/System/Alert'

import { MaxProductsProps } from '../../@types/max/products'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useMaxProducts() {
  return useQuery({
    queryKey: ['MaxProducts'],
    queryFn: async (): Promise<MaxProductsProps[] | null> => {
      try {
        const res = await api.get('/maxnivel/products')

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
