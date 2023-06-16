import { AxiosError } from 'axios'

import { alerta } from '../components/System/Alert'
import { haveData } from '../functions/general'
import { api } from '../libs/api'

export async function uploadImages(image: string) {
  try {
    const formData = new FormData()
    formData.append('file', image)
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const res = await api.post('/file', formData, config)

    const { data } = res.data

    return haveData(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    } else {
      console.error(error)
    }
  }
}
