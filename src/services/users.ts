import { alerta } from '../components/System/Alert'

import { UsersConfigProps } from '../@types/users'

import { haveData } from '../functions/general'
import { clearCharacters } from '../functions/stringsAndObjects'
import { api } from '../libs/api'
import { InputsAddNewUser } from '../pages/settings/usuarios/newUser'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useUsers() {
  return useQuery({
    queryKey: ['listUsers'],
    queryFn: async (): Promise<UsersConfigProps[] | null> => {
      try {
        const res = await api.get('/users')

        const { data } = res.data

        return haveData(data)
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

export async function addNewUser({
  geus_admin,
  geus_email,
  geus_nome,
  geus_nome_usuario,
  geus_senha,
}: InputsAddNewUser) {
  try {
    const payload = {
      geus_admin,
      geus_email,
      geus_nome,
      geus_nome_usuario,
      geus_senha,
    }

    const res = await api.post('/users', payload)

    const { success, message } = res.data

    if (success) {
      alerta(message, 1)
      location.href = '/settings/usuarios'
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data?.error))
    } else {
      console.error(error)
    }
  }
}

export async function updateUser({
  geus_admin,
  geus_email,
  geus_nome,
  geus_nome_usuario,
  geus_senha,
  geus_id,
}: InputsAddNewUser) {
  try {
    const payload = {
      geus_admin,
      geus_email,
      geus_nome,
      geus_nome_usuario,
      geus_senha,
      geus_id,
    }
    const res = await api.put(`/users/${geus_id}`, payload)

    const { success, message } = res.data

    if (success) {
      alerta(message, 1)
      location.href = '/config/users'
    }
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
    const res = await api.delete(`/users/${id}`)

    const { success, message } = res.data
    if (success) {
      alerta(message, 1)
      return true
    }
    return false
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
    return false
  }
}
