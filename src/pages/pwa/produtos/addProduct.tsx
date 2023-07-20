import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { FieldOnGrid } from '../../../components/FieldOnGrid'
import { Button } from '../../../components/Form/Button'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { addMaxProduct, updateMaxProduct } from '../../../services/max/products'
import {
  addPWACategories,
  usePWACategories,
} from '../../../services/pwa/categories'
import {
  addPWAProduct,
  updatePWAProduct,
  usePWAProducts,
} from '../../../services/pwa/products'
import {
  addPWAProviders,
  usePWAProviders,
} from '../../../services/pwa/providers'
import { updateRVProduct, useRVProducts } from '../../../services/rv/products'
import { useRVProviders } from '../../../services/rv/providers'

import { MaxProductsProps } from '../../../@types/max/products'
import { PWACategoriesProps } from '../../../@types/pwa/categories'
import { PWAProductsProps } from '../../../@types/pwa/products'
import { PWAProvidersProps } from '../../../@types/pwa/providers'
import { RVProductsProps } from '../../../@types/rv/products'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import {
  FormataValorMonetario,
  formataMoedaPFloat,
} from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { CaretLeft, CloudCheck } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function AddProduct() {
  const [currentSync, setCurrentSync] = useState<null | string>(null)

  const { data } = useRVProducts()
  const { data: ProductsPWA, isLoading, isFetching } = usePWAProducts()
  const {
    data: ProvidersPWA,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWAProviders()
  const {
    data: CategoriesPWA,
    isLoading: isLoading3,
    isFetching: isFetching3,
  } = usePWACategories()
  const {
    data: ProvidersRV,
    isLoading: isLoading4,
    isFetching: isFetching4,
  } = useRVProviders()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const router = useNavigate()
  const gridRef = useRef(null)

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 40,
      lockVisible: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      headerCheckboxSelectionCurrentPageOnly: true,
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
      minWidth: 120,
      sortable: true,
      filter: true,
      sort: 'asc',
    },
    {
      field: 'forv_provider',
      headerName: 'Fornecedor',
      flex: 1,
      minWidth: 120,
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
      maxWidth: 130,
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
      field: 'prpw_id',
      headerName: 'PWA Cad.',
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
    {
      field: 'prrv_max_id',
      headerName: 'Max Cad.',
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

  async function handleUploadProduct(data: RVProductsProps) {
    setLoading(true)
    await updateRVProduct(data)
    setLoading(false)
  }

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
      const promise = selectedData.map(async (item, index) => {
        setCurrentSync(`${index}/${selectedData.length}`)

        const productMax = {} as MaxProductsProps
        productMax.status = true
        productMax.preco = formataMoedaPFloat(
          FormataValorMonetario(item.prrv_valor, false),
        )

        productMax.nome = item.prrv_nome
        productMax.id = item.prrv_max_id ? String(item.prrv_max_id) : null // id do produto max

        let res = null
        if (item.prrv_max_id) {
          res = await updateMaxProduct(productMax)
        } else {
          res = await addMaxProduct(productMax)
        }

        const product = ProductsPWA?.find(
          (e) => e.prpw_prrv_id === item.prrv_id,
        )
        const productApp = product || ({} as PWAProductsProps)

        const provider = ProvidersPWA?.find(
          (e) => e.fopw_id === product?.prpw_fopw_id,
        )

        const category = CategoriesPWA?.find(
          (e) => e.pcpw_rv_id === product?.prpw_pcpw_id,
        )

        if (!provider) {
          const dataProvider = {} as PWAProvidersProps
          const dataNewProvider = ProvidersRV?.find(
            (e) => e.forv_id === item?.prrv_forv_id,
          )
          const checkExistProvider = ProvidersPWA?.find(
            (e) => e.fopw_forv_id === item?.prrv_forv_id,
          )

          if (dataNewProvider && !checkExistProvider) {
            dataProvider.fopw_nome = dataNewProvider?.forv_provider
            dataProvider.fopw_forv_id = dataNewProvider?.forv_id
            dataProvider.fopw_descricao = dataNewProvider?.forv_descricao
            dataProvider.fopw_termos_condicoes =
              dataNewProvider?.forv_termos_condicoes
            dataProvider.fopw_instrucoes = dataNewProvider?.forv_instrucoes
            dataProvider.fopw_imagem = dataNewProvider?.forv_logo
            dataProvider.fopw_ativo = true

            const resNewProvider = await addPWAProviders(dataProvider)

            productApp.prpw_fopw_id = resNewProvider?.fopw_id
          } else if (checkExistProvider) {
            productApp.prpw_fopw_id = checkExistProvider?.fopw_id
          }
        }

        if (!category) {
          const dataCategory = {} as PWACategoriesProps
          const checkExistCategory = CategoriesPWA?.find(
            (e) => e.pcpw_rv_id === item?.prrv_pcrv_id,
          )

          if (!checkExistCategory) {
            dataCategory.pcpw_ativo = true
            dataCategory.pcpw_rv_id = item.prrv_pcrv_id
            dataCategory.pcpw_descricao = item.pcrv_kind

            const resNewCategory = await addPWACategories(dataCategory)

            productApp.prpw_pcpw_id = resNewCategory?.pcpw_id
          } else {
            productApp.prpw_pcpw_id = checkExistCategory?.pcpw_id
          }
        }

        productApp.prpw_ativo = true
        productApp.prpw_valor = formataMoedaPFloat(
          FormataValorMonetario(item.prrv_valor, false),
        )
        productApp.prpw_prrv_id = item.prrv_id
        productApp.prpw_descricao = item.prrv_nome
        productApp.prpw_id = product?.prpw_id ?? null
        productApp.prpw_max_id = res

        let resProductApp = null
        if (productApp.prpw_id) {
          resProductApp = await updatePWAProduct(productApp)
        } else {
          resProductApp = await addPWAProduct(productApp)
        }

        item.prrv_valor = formataMoedaPFloat(
          FormataValorMonetario(item.prrv_valor, false),
        )
        item.prpw_id = resProductApp?.prpw_id
        item.prrv_max_id = res
        item.prrv_ativo = true

        await updateRVProduct(item)
      })

      await Promise.allSettled(promise)
      setCurrentSync(null)
      alerta('Sincronização finalizada', 1)
      setTimeout(() => {
        router(0)
      }, 400)
    }
  }

  return (
    <Container>
      {(isLoading ||
        isFetching ||
        isLoading2 ||
        isFetching2 ||
        isLoading3 ||
        isFetching3 ||
        isLoading4 ||
        isFetching4) && <Loader />}
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Produtos PWA / Sincronizar produto</TextHeading>
          </div>

          <div className="flex items-center">
            <Button onClick={handleSyncDataApp}>
              <CloudCheck size={18} weight="fill" /> Sincronizar produtos
              selecionados
            </Button>
          </div>
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
