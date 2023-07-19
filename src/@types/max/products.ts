export type MaxProductsProps = {
  id: string | null
  nome: string
  descricao: string
  imagem_padrao_url: string | null
  preco: string | number
  status: string | boolean
  imagem_aux?: File
  integrado_pwa?: boolean
}
