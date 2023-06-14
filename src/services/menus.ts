import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { api } from '../libs/api'

export function useMenus() {
  return useQuery({
    queryKey: ['listMenus'],
    queryFn: async () => {
      try {
        const res = await api.get('/menus')

        console.log(res)
      } catch (error) {
        if (error instanceof AxiosError) {
          alerta(error.response?.data.message)
        } else {
          console.error(error)
        }
      }
    },
  })
}
