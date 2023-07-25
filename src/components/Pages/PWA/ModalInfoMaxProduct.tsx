import { MaxProductsProps } from '../../../@types/max/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { Dialog } from '../../System/Dialog'
import { FieldInfo } from './FieldInfo'

interface FormProviderProps {
  open: boolean
  closeDialog: () => void
  id: number
  productsMax: MaxProductsProps[] | null
}

export function ModalInfoMaxProduct({
  open,
  closeDialog,
  id,
  productsMax,
}: FormProviderProps) {
  const productSelected = productsMax?.find((e) => Number(e.id) === Number(id))

  return (
    <Dialog open={open} closeDialog={closeDialog}>
      <div className="flex w-full flex-col gap-2 p-4">
        <div className="flex gap-2">
          <FieldInfo title="ID" description={productSelected?.id ?? '-'} />
          <FieldInfo title="Nome" description={productSelected?.nome ?? '-'} />
          <FieldInfo
            title="Preço"
            description={FormataValorMonetario(productSelected?.preco)}
          />
        </div>
        <div className="flex gap-2">
          <FieldInfo
            title="Descrição"
            description={
              productSelected?.descricao ? productSelected?.descricao : '-'
            }
          />
        </div>
        <div className="grid grid-cols-2  gap-2">
          {productSelected?.imagem_padrao_url && (
            <img
              src={productSelected?.imagem_padrao_url ?? ''}
              alt="Image"
              className="h-full max-h-20"
            />
          )}
          <FieldInfo
            title="Produto ativo"
            description={productSelected?.status ? 'Sim' : 'Não'}
          />
        </div>
      </div>
    </Dialog>
  )
}
