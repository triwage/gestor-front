import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { haveData } from '../functions/general'
import { api } from '../libs/api'

export function useMenus() {
  return useQuery({
    queryKey: ['listMenus'],
    queryFn: async () => {
      try {
        if (localStorage.getItem('menus')) {
          const menusLocal = localStorage.getItem('menus')
          return JSON.parse(menusLocal)
        }
        const res = await api.get('/menus')

        const { success, data } = res.data

        if (success && haveData(data)) {
          localStorage.setItem('menus', JSON.stringify(data))
          return haveData(data)
        }
        return null
      } catch (error) {
        if (error instanceof AxiosError) {
          alerta(error.response?.data.message)
        } else {
          console.error(error)
        }
        return null
      }
    },
  })
}
