import { alerta } from '../components/System/Alert'

import { haveData } from '../functions/general'
import { clearCharacters } from '../functions/stringsAndObjects'
import { api } from '../libs/api'
import { AxiosError } from 'axios'

export interface AuthProps {
  login: string
  senha: string
}

export async function Auth({ login, senha }: AuthProps) {
  try {
    const res = await api.get('/users/login', {
      params: {
        usuario: login,
        senha,
      },
    })

    const { success, data, error, message } = res.data

    if (success && haveData(data)) {
      localStorage.setItem('token', data.token)
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`
      alerta(message, 1)
      return true
    }
    alerta(error)
    return false
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
    return false
  }
}
