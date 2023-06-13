import { alerta } from '../components/System/Alert'
import { api } from '../libs/api'

export interface AuthProps {
  login: string
  senha: string
}

export async function Auth({ login, senha }: AuthProps) {
  try {
    const res = await api.get('/ManagerUsers/login', {
      params: {
        nomeDeUsuario: login,
        senha,
      },
    })

    const { success, data, error, message } = res.data

    if (success) {
      localStorage.setItem('token', data.token)
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`
      alerta(message, 1)
      return true
    }
    alerta(error)
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
