import axios from 'axios'

import { alerta } from '../components/System/Alert'
import { EnviromentVars } from '../config/env'

const token = localStorage.getItem('token')

export const api = axios.create({
  baseURL: EnviromentVars.urlTriwageBack,
})

api.interceptors.request.use(async (config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response !== undefined && error.response.status === 401) {
      alerta('Sessão expirada!')
      localStorage.removeItem('token')
      location.href = '/login'
    } else {
      return Promise.reject(error)
    }
  },
)
