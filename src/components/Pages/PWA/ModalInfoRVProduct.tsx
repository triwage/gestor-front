import { ListRVIndividual } from '../../../services/rv/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { Dialog } from '../../System/Dialog'
import { Loader } from '../../System/Loader'
import { TextAction } from '../../Texts/TextAction'
import { FieldInfo } from './FieldInfo'
import { useQuery } from '@tanstack/react-query'

interface ModalInfoRVProductProps {
  open: boolean
  closeDialog: () => void
  id: number
}

export function ModalInfoRVProduct({
  open,
  closeDialog,
  id,
}: ModalInfoRVProductProps) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['RVProductIndividual', id],
    queryFn: async () => await ListRVIndividual(id),
  })

  return (
    <Dialog open={open} closeDialog={closeDialog}>
      {(isLoading || isFetching) && <Loader />}
      {data && data.length > 0 && (
        <div className="flex w-full flex-col gap-2 p-4">
          <div className="flex gap-2">
            <FieldInfo title="ID" description={data[0]?.prrv_id ?? '-'} />
            <FieldInfo title="Nome" description={data[0]?.prrv_nome ?? '-'} />
            <FieldInfo
              title="Preço"
              description={FormataValorMonetario(data[0]?.prrv_valor)}
            />
          </div>
          <div className="flex gap-2">
            <FieldInfo
              title="Valor mínimo"
              description={FormataValorMonetario(data[0]?.prrv_valor_maximo)}
            />
            <FieldInfo
              title="Valor máximo"
              description={FormataValorMonetario(data[0]?.prrv_valor_maximo)}
            />
          </div>
          <div className="grid grid-cols-2  gap-2">
            <FieldInfo
              title="Fornecedor"
              description={data[0]?.forv_provider ?? '-'}
            />
            <FieldInfo
              title="Categoria"
              description={data[0]?.pcrv_kind ?? '-'}
            />
            <FieldInfo
              title="Produto ativo"
              description={data[0]?.prrv_ativo ? 'Sim' : 'Não'}
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
