import { alerta } from '../../components/System/Alert'

import { BannersProps } from '../../@types/pwa/banners'

import { haveData } from '../../functions/general'
import { clearCharacters } from '../../functions/stringsAndObjects'
import { api } from '../../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useBanners() {
  return useQuery({
    queryKey: ['listBanners'],
    queryFn: async () => {
      try {
        const res = await api.get('/banners')

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

export async function addNewBanner(data: BannersProps) {
  try {
    const payload = {
      geba_botao_acao: data.geba_botao_acao,
      geba_imagem: data.geba_imagem,
      geba_status: data.geba_status,
      geba_dta_validade: data.geba_dta_validade,
    }

    const res = await api.post('/banners', payload)

    const { success, message, error } = res.data

    if (success) {
      alerta(message, 1)
      location.href = '/pwa/banners'
    } else {
      alerta(clearCharacters(error))
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(clearCharacters(error.response?.data.message))
    } else {
      console.error(error)
    }
  }
}

export async function updateBanner(data: BannersProps) {
  try {
    const payload = {
      geba_botao_acao: data.geba_botao_acao,
      geba_imagem: data.geba_imagem,
      geba_status: data.geba_status,
      geba_dta_validade: data.geba_dta_validade,
    }

    const res = await api.put(`/banners/${data.geba_id}`, payload)

    const { success, message, error } = res.data

    if (success) {
      alerta(message, 1)
      setTimeout(() => {
        location.href = '/pwa/banners'
      }, 400)
    } else {
      alerta(clearCharacters(error))
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}

export async function deleteBanner(id: number) {
  try {
    const res = await api.delete(`/banners/${id}`)

    const { success, message, error } = res.data

    if (success) {
      alerta(message, 1)
      setTimeout(() => {
        location.href = '/pwa/banners'
      }, 400)
    } else {
      alerta(clearCharacters(error))
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}
