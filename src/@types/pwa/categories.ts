export interface PWACategoriesProps {
  pcpw_id: number
  pcpw_cash_id: number | null
  cash_descricao: string
  pcpw_descricao: string
  pcpw_imagem: string | null
  pcpw_ativo: boolean
}

export interface Category {
  fopc_id: number
  fopc_pcpw_id: number
  pcpw_descricao: string
}

export interface PWACategoriesProvidersProps {
  fopc_fopw_id: number
  fopw_nome: string
  categorias: Category[]
}

export interface ProvidesInCategories {
  fopc_id: number
  fopc_fopw_id: number
  pcpw_descricao: string
}

export interface PWAProvidersInCategoriesProps {
  fopc_pcpw_id: number
  pcpw_descricao: string
  fornecedores: ProvidesInCategories[]
}

export interface PWAAddProductsCategoriesProps {
  prpc_pcpw_id: number // categoria id
  fopc_fopw_id: number // provider id
}
