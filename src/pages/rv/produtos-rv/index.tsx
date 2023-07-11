import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { FieldOnGrid } from '../../../components/FieldOnGrid'
import { Button } from '../../../components/Form/Button'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { addMaxProduct, updateMaxProduct } from '../../../services/max/products'
import { addPWAProduct, updatePWAProduct } from '../../../services/pwa/products'
import { updateRVProduct, useRVProducts } from '../../../services/rv/products'

import { MaxProductsProps } from '../../../@types/max/products'
import { PWAProductsProps } from '../../../@types/pwa/products'
import { RVProductsProps } from '../../../@types/rv/products'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function RVProducts() {
  const [currentSync, setCurrentSync] = useState<null | string>(null)

  const { data } = useRVProducts()

  const { Confirm } = useConfirm()
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
      headerCheckboxSelectionCurrentPageOnly: true,
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

  async function handleSyncDataApp() {
    const selectedData =
      // @ts-expect-error
      gridRef?.current?.api?.getSelectedRows() as RVProductsProps[]

    if (selectedData.length === 0) {
      alerta('Nenhum produto foi selecionado', 4)
      return
    }
    const sameInApp = selectedData?.some((e) => e.prpw_id)
    let message = 'Sincronizar produtos no APP'
    if (sameInApp) {
      message = 'Ao continuar poderá substituir dados já existentes'
    }

    const check = await Confirm({
      title: `${selectedData.length} produtos selecionados`,
      message,
    })

    if (check) {
      let allSuccess = true
      selectedData.forEach(async (item, index) => {
        setCurrentSync(`${index}/${selectedData.length}`)
        const productApp = {} as PWAProductsProps
        productApp.prpw_ativo = item.prrv_ativo
        productApp.prpw_valor = item.prrv_valor
        productApp.prpw_prrv_id = item.prrv_id
        productApp.prpw_descricao = item.prrv_nome
        productApp.prpw_id = item.prpw_id
        let res = true
        if (item.prpw_id) {
          res = await updatePWAProduct(productApp)
        } else {
          res = await addPWAProduct(productApp)
        }

        if (!res) {
          allSuccess = false
        }
      })
      if (allSuccess) {
        alerta('Sincronização finalizada', 1)
      }
      setCurrentSync(null)
      setTimeout(() => {
        router(0)
      }, 400)
    }
  }

  async function handleSyncDataMax() {
    const selectedData =
      // @ts-expect-error
      gridRef?.current?.api?.getSelectedRows() as RVProductsProps[]

    if (selectedData.length === 0) {
      alerta('Nenhum produto foi selecionado', 4)
      return
    }
    const sameInApp = selectedData?.some((e) => e.prrv_max_id)
    let message = 'Sincronizar produtos na Max nível'
    if (sameInApp) {
      message = 'Ao continuar poderá substituir dados já existentes'
    }

    const check = await Confirm({
      title: `${selectedData.length} produtos selecionados`,
      message,
    })

    if (check) {
      let allSuccess = true
      selectedData.forEach(async (item, index) => {
        setCurrentSync(`${index}/${selectedData.length}`)
        const productMax = {} as MaxProductsProps
        productMax.status = item.prrv_ativo
        productMax.preco = item.prrv_valor
        productMax.nome = item.prrv_nome
        productMax.id = String(item.prrv_max_id) // id do produto max
        let res = true
        if (item.prrv_max_id) {
          res = await updateMaxProduct(productMax)
        } else {
          res = await addMaxProduct(productMax)
        }
        if (!res) {
          allSuccess = false
        }
      })
      if (allSuccess) {
        alerta('Sincronização finalizada', 1)
      }
      setCurrentSync(null)
      setTimeout(() => {
        router(0)
      }, 400)
    }
  }

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos RV</TextHeading>
        </div>

        {currentSync && (
          <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-opacity">
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="loader-spin"></div>
              <div className="flex flex-col items-center justify-center">
                <TextAction
                  size="md"
                  className="font-bold text-white dark:text-white"
                >
                  {currentSync}
                </TextAction>
                <TextAction
                  size="md"
                  className="font-bold text-white dark:text-white"
                >
                  Sincronizando
                </TextAction>
              </div>
            </div>
          </div>
        )}

        <div className="my-2 flex w-full items-center gap-2">
          <Button
            variant="structure"
            className="bg-green text-white"
            onClick={handleSyncDataApp}
          >
            Sincronizar com o APP
          </Button>
          <Button
            onClick={handleSyncDataMax}
            variant="structure"
            className="bg-purple text-white"
          >
            Sincronizar com a Max Nível
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
