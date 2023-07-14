export interface PWAProductsProps {
  prpw_id: number | null
  prpw_prrv_id: number
  prpw_max_id: number
  prpw_cash_id: number
  cash_descricao: string | null
  prpw_pcpw_id: number
  pcpw_descricao: string | null
  prpw_fopw_id: number
  fopw_descricao: string | null
  prpw_descricao: string | null
  prpw_imagem: string
  prpw_valor: string | null | number
  prpw_ativo: boolean
}

export interface Categoryes {
  prpc_id: number
  prpc_pcpw_id: number
  pcpw_descricao: string
}

export interface PWACategoriesOfProducts {
  prpc_prpw_id: number
  prpw_descricao: string
  categorias: Categoryes[]
}

export interface PWAProductsCategoriesProps {
  prpc_pcpw_id: number // categoria id
  prpc_prpw_id: number // produto id
}
