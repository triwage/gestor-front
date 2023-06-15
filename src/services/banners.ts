import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { api } from '../libs/api'
import { InputsAddBanner } from '../pages/banners/addBanner'

export function useBanners() {
  return useQuery({
    queryKey: ['listBanners'],
    queryFn: async () => {
      try {
        const res = await api.get('/banners')

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

export async function addNewBanner({
  gebaTitulo,
  gebaSubtitulo,
  gebaBotaoTexto,
  gebaBotaoAcao,
  gebaImagem,
  gebaStatus,
  gebaDtaValidade,
}: InputsAddBanner) {
  try {
    const payload = {
      gebaTitulo,
      gebaSubtitulo,
      gebaBotaoTexto,
      gebaBotaoAcao,
      gebaImagem,
      gebaStatus,
      gebaDtaValidade,
    }

    const res = await api.post('/banners', payload)

    console.log(res)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}

export async function updateUser({
  gebaTitulo,
  gebaSubtitulo,
  gebaBotaoTexto,
  gebaBotaoAcao,
  gebaImagem,
  gebaStatus,
  gebaDtaValidade,
  id,
}: InputsAddBanner) {
  try {
    const payload = {
      gebaTitulo,
      gebaSubtitulo,
      gebaBotaoTexto,
      gebaBotaoAcao,
      gebaImagem,
      gebaStatus,
      gebaDtaValidade,
    }

    const res = await api.put(`/banners/${id}`, payload)

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
    const res = await api.delete(`/banners/${id}`)

    console.log(res)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}
