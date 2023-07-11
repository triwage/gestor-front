import { alerta } from '../components/System/Alert'

import { haveData } from '../functions/general'
import { api } from '../libs/api'

export async function uploadImages(image: File) {
  try {
    const formData = new FormData()
    formData.append('file', image)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const res = await api.post('/file', formData, config)

    const { data } = res.data

    return haveData(data)
  } catch (error) {
    alerta('Não foi possível anexar o arquivo')
    return null
  }
}
