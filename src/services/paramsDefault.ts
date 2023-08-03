import { alerta } from '../components/System/Alert'

import { UpdateParamsDefaultProps } from '../@types/paramsDefault'

import { haveData } from '../functions/general'
import { api } from '../libs/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useParamsDefault() {
  return useQuery({
    queryKey: ['listParamsDefault'],
    queryFn: async () => ListParamsDefault(),
  })
}

export async function ListParamsDefault(): Promise<UpdateParamsDefaultProps | null> {
  try {
    const res = await api.get('/pwa/parameters')

    const { data } = res.data

    return haveData(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    }
    return null
  }
}

export async function updateParamsDefault(data: UpdateParamsDefaultProps) {
  try {
    const payload = {
      para_id: 1,
      para_prod_pgto_pwa_id: data.para_prod_pgto_pwa_id,
      para_imagem: data.para_imagem,
      para_imagem_padrao_fornecedor: data.para_imagem_padrao_fornecedor,
      para_imagem_padrao_categoria: data.para_imagem_padrao_categoria,
    }

    const res = await api.put('/pwa/parameters', payload)

    const { success } = res.data

    if (success) {
      alerta('Parâmetro atualizado com sucesso', 1)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alerta(error.response?.data.message)
    }
    return null
  }
}
