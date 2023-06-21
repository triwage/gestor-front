import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { api } from '../libs/api'
import { InputsAddNewUser } from '../pages/users/newUser'

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

export async function addNewUser({
  nomeCompleto,
  nomeDeUsuario,
  email,
  senha,
  geusAdmin,
}: InputsAddNewUser) {
  try {
    const payload = {
      nomeCompleto,
      nomeDeUsuario,
      email,
      senha,
      geusAdmin,
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
