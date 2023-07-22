import { MaxProductsProps } from '../../../@types/max/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { Dialog } from '../../System/Dialog'
import { FieldInfo } from './FieldInfo'

interface FormProviderProps {
  open: boolean
  closeDialog: () => void
  data: MaxProductsProps
}

export function ModalInfoMaxProduct({
  open,
  closeDialog,
  data,
}: FormProviderProps) {
  return (
    <Dialog open={open} closeDialog={closeDialog}>
      <div className="flex w-full flex-col gap-2 p-4">
        <div className="flex gap-2">
          <FieldInfo title="ID" description={data.id ?? '-'} />
          <FieldInfo title="Nome" description={data.nome} />
          <FieldInfo
            title="Preço"
            description={FormataValorMonetario(data?.preco)}
          />
        </div>
        <div className="flex gap-2">
          <FieldInfo title="Descrição" description={data?.descricao ?? '-'} />
        </div>
        <div className="grid grid-cols-2  gap-2">
          {data.imagem_padrao_url && (
            <img
              src={data.imagem_padrao_url ?? ''}
              alt="Image"
              className="h-full max-h-20"
            />
          )}
          <FieldInfo
            title="Produto ativo"
            description={data?.status ? 'Sim' : 'Não'}
          />
        </div>
      </div>
    </Dialog>
  )
}
