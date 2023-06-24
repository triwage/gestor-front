import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PencilSimple } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { FieldOnGrid } from '../../../components/FieldOnGrid'
import { Dialog } from '../../../components/System/Dialog'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'
import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { useRVProducts } from '../../../services/rv/products'
import { Container } from '../../../template/Container'

interface Inputs {
  products: string
}

export default function RVProducts() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data } = useRVProducts()

  const router = useNavigate()
  const { setLoading } = useLoading()
  const formProducts = useForm<Inputs>()
  const { watch } = formProducts

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
                router('newProduct', {
                  state: params.data,
                })
              }}
              className="h-full w-full"
            >
              <PencilSimple size={20} weight="fill" className="text-primary" />
            </Icon>
          </div>
        )
      },
    },
    {
      field: 'prrv_id',
      headerName: 'ID',
      maxWidth: 60,
    },
    {
      field: 'prrv_nome',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'forv_provider',
      headerName: 'Fornecedor',
      flex: 1,
      filter: true,
      valueSetter: (params) => {
        const newVal = params.newValue
        const valueChanged = params.data.forv_provider !== newVal
        if (valueChanged) {
          params.data.forv_provider = newVal
        }
        return valueChanged
      },
    },
    {
      field: 'pcrv_kind',
      headerName: 'Tipo',
      maxWidth: 150,
      sortable: true,
      filter: true,
    },
    {
      field: 'prrv_valor',
      headerName: 'Valor',
      maxWidth: 150,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'prrv_valor_minimo',
      headerName: 'Valor mínimo',
      maxWidth: 150,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'prrv_valor_maximo',
      headerName: 'Valor máximo',
      maxWidth: 150,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'prrv_ativo',
      headerName: 'Ativo',
      maxWidth: 80,
      sortable: true,
      editable: true,
      cellEditor: FieldOnGrid,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      cellStyle: (params) => {
        if (params.value) {
          return { color: '#fff', backgroundColor: '#15803d' }
        } else {
          return { color: '#fff', backgroundColor: '#ed3241' }
        }
      },
      cellRenderer: (params: { value: boolean }) => {
        if (params.value) {
          return 'Sim'
        } else {
          return 'Não'
        }
      },
    },
  ])

  // const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
  //   console.log('Data after change is', event.data)
  // }, [])

  const productsFilter = useMemo(() => {
    if (watch('products') && watch('products') !== 'undefined') {
      const lowerSearch = watch('products').toLowerCase()
      return data?.filter((p) =>
        p.prrv_nome.toLowerCase().includes(lowerSearch),
      )
    }
    return data
  }, [watch('products'), data])

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos RV</TextHeading>
        </div>

        {/* <FormProvider {...formProducts}>
          <form className="my-1">
            <Input name="products" label="Pesquisar produto" />
          </form>
        </FormProvider> */}
        <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
          <AgGridReact
            rowData={productsFilter}
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
