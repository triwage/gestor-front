import { useState } from 'react'

import { SyncMax } from '../../../components/Pages/Sync/Products/SyncMaxNivel'
import { SyncPWA } from '../../../components/Pages/Sync/Products/SyncPWA'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { useRVProducts } from '../../../services/rv/products'

import { RVProductsProps } from '../../../@types/rv/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { Broadcast, DeviceMobile } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function Synchronization() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenFormMax, setIsOpenFormMax] = useState(false)
  const [productAdd, setProductAdd] = useState<null | RVProductsProps>(null)
  const { data } = useRVProducts()

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 70,
      lockVisible: true,
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { data: RVProductsProps }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-full w-full items-center justify-center gap-1">
              <Icon
                title="Sincronizar com Max nível"
                onClick={() => {
                  setProductAdd(params.data)
                  setIsOpenFormMax(true)
                }}
                className="h-full w-full"
              >
                <Broadcast
                  size={20}
                  weight="fill"
                  className="text-primary dark:text-white"
                />
              </Icon>
            </div>
            <div className="flex h-full w-full items-center justify-center gap-1">
              <Icon
                title="Sincronizar com PWA"
                onClick={() => {
                  setProductAdd(params.data)
                  setIsOpenForm(true)
                }}
                className="h-full w-full"
              >
                <DeviceMobile
                  size={20}
                  weight="fill"
                  className="text-primary dark:text-white"
                />
              </Icon>
            </div>
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

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos RV</TextHeading>
        </div>

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

      <SyncPWA
        open={isOpenForm}
        onClosed={() => setIsOpenForm(false)}
        prpw_descricao={productAdd?.prrv_nome}
        prpw_valor={productAdd?.prrv_valor}
        prpw_ativo={productAdd?.prrv_ativo}
        productRv={productAdd?.prrv_rv_id}
        category={productAdd?.prrv_pcrv_id}
        provider={productAdd?.prrv_forv_id}
      />
      <SyncMax
        open={isOpenFormMax}
        onClosed={() => setIsOpenFormMax(false)}
        nome={productAdd?.prrv_nome}
        preco={productAdd?.prrv_valor}
        status={productAdd?.prrv_ativo}
      />
    </Container>
  )
}
