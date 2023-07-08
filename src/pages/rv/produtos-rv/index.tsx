import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { FieldOnGrid } from '../../../components/FieldOnGrid'
import { Button } from '../../../components/Form/Button'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { updateRVProduct, useRVProducts } from '../../../services/rv/products'

import { RVProductsProps } from '../../../@types/rv/products'

import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function RVProducts() {
  const { data } = useRVProducts()

  const { setLoading } = useLoading()

  const router = useNavigate()
  const gridRef = useRef(null)

  async function handleUploadProduct(data: RVProductsProps) {
    setLoading(true)
    await updateRVProduct(data)
    setLoading(false)
  }

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 70,
      lockVisible: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { data: RVProductsProps }) => {
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
              <NotePencil
                size={22}
                weight="fill"
                className="text-primary dark:text-white"
              />
            </Icon>
          </div>
        )
      },
    },
    {
      field: 'prrv_id',
      headerName: 'ID',
      sort: 'asc',
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
      valueSetter: (params) => {
        const newVal = params.newValue
        params.data.prrv_ativo = newVal
        handleUploadProduct(params.data)
        return newVal
      },
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

  function handleSyncData() {
    // @ts-expect-error
    const selectedData = gridRef?.current?.api?.getSelectedRows()

    console.log(selectedData)
  }
  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos RV</TextHeading>
        </div>

        <div className="my-2 flex w-full items-center gap-2">
          <Button
            variant="structure"
            className="bg-green text-white"
            onClick={handleSyncData}
          >
            Sincronizar com APP
          </Button>
          <Button variant="structure" className="bg-purple text-white">
            Sincronizar com Max Nível
          </Button>
        </div>

        <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columnDefs}
            animateRows={true}
            pagination={true}
            paginationPageSize={17}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            gridOptions={{ localeText: AgGridTranslation }}
          />
        </div>
      </div>
    </Container>
  )
}
