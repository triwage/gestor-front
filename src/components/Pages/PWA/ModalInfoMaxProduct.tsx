import { ListMaxProduct } from '../../../services/max/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { Dialog } from '../../System/Dialog'
import { Loader } from '../../System/Loader'
import { TextAction } from '../../Texts/TextAction'
import { FieldInfo } from './FieldInfo'
import { useQuery } from '@tanstack/react-query'

interface FormProviderProps {
  open: boolean
  closeDialog: () => void
  id: number
}

export function ModalInfoMaxProduct({
  open,
  closeDialog,
  id,
}: FormProviderProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['MaxProductIndividual', id],
    queryFn: async () => await ListMaxProduct(id),
  })

  return (
    <Dialog open={open} closeDialog={closeDialog}>
      {(isLoading || isFetching) && <Loader />}
      {data && data.length > 0 && (
        <div className="flex w-full flex-col gap-2 p-4">
          <div className="flex gap-2">
            <FieldInfo title="ID" description={data[0]?.id ?? '-'} />
            <FieldInfo title="Nome" description={data[0]?.nome ?? '-'} />
            <FieldInfo
              title="Preço"
              description={FormataValorMonetario(data[0]?.preco)}
            />
          </div>
          <div className="flex gap-2">
            <FieldInfo
              title="Descrição"
              description={data[0]?.descricao ? data[0]?.descricao : '-'}
            />
          </div>
          <div className="grid grid-cols-2  gap-2">
            {data[0]?.imagem_padrao_url && (
              <img
                src={data[0]?.imagem_padrao_url ?? ''}
                alt="Image"
                className="h-full max-h-20"
              />
            )}
            <FieldInfo
              title="Produto ativo"
              description={data[0]?.status ? 'Sim' : 'Não'}
            />
          </div>
        </div>
      )}
      {!isLoading && !isFetching && !data && (
        <TextAction className="p-4 font-semibold">
          Nenhum dado para ser exibido!
        </TextAction>
      )}
    </Dialog>
  )
}
