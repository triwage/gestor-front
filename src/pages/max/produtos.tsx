import { useState } from 'react'
import { useNavigate } from 'react-router'

import { FieldOnGrid } from '../../components/FieldOnGrid'
import { Dialog } from '../../components/System/Dialog'
import { Icon } from '../../components/System/Icon'
import { TextHeading } from '../../components/Texts/TextHeading'

import { useMaxProducts } from '../../services/max/products'

import useLoading from '../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../functions/currency'
import { AgGridTranslation } from '../../libs/apiGridTranslation'
import { Container } from '../../template/Container'
import { PencilSimple } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function MaxProducts() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data } = useMaxProducts()

  const router = useNavigate()
  const { setLoading } = useLoading()

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 40,
      lockVisible: true,
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              onClick={() => {
                router('updateProduct', {
                  state: params.data,
                })
              }}
              className="h-full w-full"
            >
              <PencilSimple
                size={20}
                weight="fill"
                className="text-primary dark:text-white"
              />
            </Icon>
          </div>
        )
      },
    },
    {
      field: 'id',
      headerName: 'ID',
      sort: 'asc',
      maxWidth: 80,
    },
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1,
      filter: true,
    },
    {
      field: 'preco',
      headerName: 'Preço',
      maxWidth: 150,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'imagem_padrao_url',
      headerName: 'Imagem',
      maxWidth: 85,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params) => {
        if (params.value) {
          return <img src={params.value} alt="Imagem" width={24} height={24} />
        }
        return '-'
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 80,
      sortable: true,
      cellStyle: (params) => {
        if (params.value) {
          return { color: '#fff', backgroundColor: '#15803d' }
        } else {
          return { color: '#fff', backgroundColor: '#ed3241' }
        }
      },
      cellRenderer: (params: { value: boolean }) => {
        if (params.value) {
          return 'Ativo'
        } else {
          return 'Inativo'
        }
      },
    },
  ])

  // const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
  //   console.log('Data after change is', event.data)
  // }, [])

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos Max Nível</TextHeading>
        </div>

        {/* <FormProvider {...formProducts}>
          <form className="my-1">
            <Input name="products" label="Pesquisar produto" />
          </form>
        </FormProvider> */}
        <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            animateRows={true}
            pagination={true}
            paginationPageSize={17}
            gridOptions={{ localeText: AgGridTranslation }}
          />
        </div>
      </div>

      <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex w-full">sdasda</div>
      </Dialog>
    </Container>
  )
}
