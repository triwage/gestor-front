import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { ModalInfoMaxProduct } from '../../../components/Pages/PWA/ModalInfoMaxProduct'
import { ModalInfoRVProduct } from '../../../components/Pages/PWA/ModalInfoRVProduct'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import {
  deletePWAProduct,
  usePWAProducts,
} from '../../../services/pwa/products'

import { PWAProductsProps } from '../../../@types/pwa/products'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import {
  ArrowSquareOut,
  ArrowsDownUp,
  NotePencil,
  PlusCircle,
  TrashSimple,
} from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function PWAProducts() {
  const [isOpenModalMaxProduct, setIsOpenModalMaxProduct] = useState(false)
  const [idData, setIdData] = useState<number | null>(null)
  const [idDataProductRV, setIdDataProductRV] = useState<number | null>(null)
  const [isOpenModalRV, setIsOpenModalRV] = useState(false)
  const queryClient = useQueryClient()
  const router = useNavigate()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const { data, isLoading, isFetching } = usePWAProducts()

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 60,
      lockVisible: true,
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { data: PWAProductsProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-2">
            <Icon
              onClick={() => {
                router('updateProduct', {
                  state: {
                    product: params.data,
                  },
                })
              }}
              className="h-full w-full"
            >
              <NotePencil
                size={20}
                weight="fill"
                className="text-primary dark:text-white"
              />
            </Icon>
            <Icon
              onClick={() => {
                if (!params.data.produto_padrao) {
                  handleDeleteProduct(Number(params.data.prpw_id))
                } else {
                  alerta(
                    'Essa é o produto padrão, ele não pode ser excluído',
                    4,
                  )
                }
              }}
              className="h-full w-full"
            >
              <TrashSimple
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
      field: 'prpw_id',
      headerName: 'ID',
      maxWidth: 60,
      sortable: true,
      filter: true,
    },
    {
      field: 'prpw_descricao',
      headerName: 'Nome',
      flex: 1,
      minWidth: 130,
      sortable: true,
      filter: true,
      sort: 'asc',
    },
    {
      field: 'prpw_valor',
      headerName: 'Valor',
      maxWidth: 130,
      minWidth: 90,
      flex: 1,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'prrv_nome',
      headerName: 'Produto RV',
      flex: 1,
      minWidth: 170,
      sortable: true,
      filter: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      },
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params.data.prpw_max_id) {
          return (
            <>
              <TextAction className="text-[15px] font-medium">{`${
                params?.data?.prpw_prrv_id ?? 'N/A'
              } - ${params?.data?.prrv_nome ?? 'N/A'}`}</TextAction>
              <Icon
                onClick={() => {
                  setIdDataProductRV(params.data.prpw_prrv_id)
                  setIsOpenModalRV(true)
                }}
                className="h-4 w-4"
              >
                <ArrowSquareOut
                  size={18}
                  weight="fill"
                  className="text-black dark:text-white"
                />
              </Icon>
            </>
          )
        } else {
          return '-'
        }
      },
    },
    {
      field: 'pcpw_descricao',
      headerName: 'Categoria principal',
      flex: 1,
      minWidth: 90,
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params?.data) {
          return `${params?.data?.prpw_pcpw_id ?? 'N/A'} - ${
            params?.data?.pcpw_descricao ?? 'N/A'
          }`
        }
      },
    },
    {
      field: 'fopw_descricao',
      headerName: 'Fornecedor principal',
      flex: 1,
      minWidth: 90,
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params?.data) {
          return `${params?.data?.prpw_fopw_id ?? 'N/A'} - ${
            params?.data?.fopw_nome ?? 'N/A'
          }`
        }
      },
    },
    {
      field: 'cash_descricao',
      headerName: 'Cashback',
      minWidth: 90,
      flex: 1,
      sortable: true,
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params?.data) {
          return `${params?.data?.prpw_cash_id ?? 'N/A'} - ${
            params?.data?.cash_descricao ?? 'N/A'
          }`
        }
      },
    },
    {
      field: 'prpw_ativo',
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
      cellRenderer: (params: { value: string }) => {
        if (params.value) {
          return 'Ativo'
        } else {
          return 'Inativo'
        }
      },
    },
    {
      field: 'prpw_max_id',
      headerName: 'Max ID',
      maxWidth: 90,
      minWidth: 60,
      sortable: true,
      cellStyle: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params.data.prpw_max_id) {
          return (
            <div className="flex items-center justify-center gap-1">
              <TextAction className="text-[15px] font-medium">
                {params.data.prpw_max_id}
              </TextAction>
              <Icon
                onClick={() => {
                  setIdData(params.data.prpw_max_id)
                  setIsOpenModalMaxProduct(true)
                }}
                className="h-4 w-4"
              >
                <ArrowSquareOut
                  size={20}
                  weight="fill"
                  className="text-black dark:text-white"
                />
              </Icon>
            </div>
          )
        } else {
          return '-'
        }
      },
    },
  ])

  const { mutateAsync: handleDeleteProduct } = useMutation(
    async (id: number) => {
      const check = await Confirm({
        title: 'Excluir produto',
        message: 'Tem certeza que deseja excluir esse produto?',
      })

      if (check) {
        setLoading(true)
        const res = await deletePWAProduct(id)

        if (res) {
          const updateData = data?.filter((e) => e.prpw_id !== id)
          queryClient.setQueryData(['PWAProducts'], updateData)
        }
        setLoading(false)
      }
    },
  )

  return (
    <Container>
      {(isLoading || isFetching) && <Loader />}
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Produtos PWA</TextHeading>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Button
                variant="structure"
                className="bg-purple text-white"
                onClick={() => {
                  router('addProduct')
                }}
              >
                <ArrowsDownUp size={18} /> Sincronizar produtos
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                onClick={() => {
                  router('updateProduct')
                }}
              >
                <PlusCircle size={18} /> Adicionar produto
              </Button>
            </div>
          </div>
        </div>

        <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
          <AgGridReact
            rowData={data ?? []}
            columnDefs={columnDefs}
            animateRows={true}
            pagination={true}
            paginationPageSize={17}
            gridOptions={{ localeText: AgGridTranslation }}
          />
        </div>
      </div>

      {idData && isOpenModalMaxProduct && (
        <ModalInfoMaxProduct
          open={isOpenModalMaxProduct}
          closeDialog={() => setIsOpenModalMaxProduct(false)}
          id={idData}
        />
      )}

      {idDataProductRV && isOpenModalRV && (
        <ModalInfoRVProduct
          open={isOpenModalRV}
          closeDialog={() => setIsOpenModalRV(false)}
          id={idDataProductRV}
        />
      )}
    </Container>
  )
}
