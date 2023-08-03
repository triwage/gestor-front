import { useEffect, useState } from 'react'

import { ListProductPWAIndividual } from '../../../services/pwa/products'

import Logo from '../../../assets/logo.png'
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

export function ModalInfoPWAProduct({
  open,
  closeDialog,
  id,
}: FormProviderProps) {
  const [imagem, setImagem] = useState<any>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['PWAProductIndividual', id],
    queryFn: async () => await ListProductPWAIndividual(id),
  })

  useEffect(() => {
    const resImage = new Image()
    if (data && data[0]?.prpw_imagem) {
      resImage.src = data[0]?.prpw_imagem

      resImage.onload = function () {
        setImagem(data[0]?.prpw_imagem)
      }
      resImage.onerror = function () {
        setImagem(null)
      }
    }
  }, [data])

  console.log(imagem)

  return (
    <Dialog open={open} closeDialog={closeDialog}>
      {(isLoading || isFetching) && <Loader />}
      {data && data.length > 0 && (
        <div className="flex w-full flex-col gap-2 p-4">
          <div className="flex gap-2">
            <FieldInfo title="ID" description={data[0]?.prpw_id ?? '-'} />
            <FieldInfo
              title="Nome"
              description={data[0]?.prpw_descricao ?? '-'}
            />
            <FieldInfo
              title="Preço"
              description={FormataValorMonetario(data[0]?.prpw_valor)}
            />
          </div>
          <div className="flex gap-2">
            <FieldInfo
              title="Categoria"
              description={data[0].pcpw_descricao ?? '-'}
            />
            <FieldInfo
              title="Fornecedor"
              description={data[0].fopw_descricao ?? '-'}
            />
            <FieldInfo
              title="Cashback"
              description={data[0].cash_descricao ?? '-'}
            />
          </div>
          <div className="flex gap-2">
            <FieldInfo
              title="ID Produto RV"
              description={data[0].prpw_prrv_id ?? '-'}
            />
            <FieldInfo
              title="ID Produto MAX"
              description={data[0].prpw_max_id ?? '-'}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {imagem ? (
              <img src={imagem} alt="Image" className="h-full max-h-20" />
            ) : (
              <img src={Logo} alt="Image" className="h-full max-h-20" />
            )}

            <FieldInfo
              title="Produto ativo"
              description={data[0]?.prpw_ativo ? 'Sim' : 'Não'}
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
