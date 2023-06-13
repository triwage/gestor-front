import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { api } from '../libs/api'

export function useUsers() {
  return useQuery({
    queryKey: ['listUsers'],
    queryFn: async () => {
      try {
        const res = await api.get('/ManagerUsers')

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

export async function addNewUser() {
  try {
    const payload = {
      nomeCompleto: 'Teste de Oliveira',
      nomeDeUsuario: 'testeoliv',
      email: 'teste12@gmail.com',

      senha: '1234567',
    }
    const res = await api.post('/ManagerUsers', payload)

    console.log(res)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}

export async function updateUser(id: number) {
  try {
    const res = await api.put(`/ManagerUsers/${id}`)

    console.log(res)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await api.delete(`/ManagerUsers/${id}`)

    console.log(res)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}
