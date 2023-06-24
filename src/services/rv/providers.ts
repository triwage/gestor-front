import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RVProvidersProps } from '../../@types/rv/providers'
import { alerta } from '../../components/System/Alert'
import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'

export function useRVProviders() {
  return useQuery({
    queryKey: ['RVProviders'],
    queryFn: async (): Promise<RVProvidersProps[] | null> => {
      try {
        const res = await api.get('/rv/providers')

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
