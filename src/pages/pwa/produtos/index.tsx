import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { ModalInfoMaxProduct } from '../../../components/Pages/PWA/ModalInfoMaxProduct'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { ListAllProductsInMax } from '../../../services/max/products'
import {
  deletePWAProduct,
  usePWAProducts,
} from '../../../services/pwa/products'

import { useEditProductPWAStore } from '../../../store/useEditProductPWAStore'

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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function PWAProducts() {
  const [isOpenModalMaxProduct, setIsOpenModalMaxProduct] = useState(false)
  const [idData, setIdData] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const router = useNavigate()
  const { setAllProductMax } = useEditProductPWAStore()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const { data, isLoading, isFetching } = usePWAProducts()

  const {
    status,
    fetchStatus,
    data: ProductsMax,
  } = useQuery({
    queryKey: ['allProductsMax'],
    queryFn: async () => {
      const res = await ListAllProductsInMax()
      setAllProductMax(res)
      return res
    },
  })

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
                    productMax: Number(params.data.prpw_max_id),
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
              onClick={() => handleDeleteProduct(Number(params.data.prpw_id))}
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
      field: 'prrv_nome',
      headerName: 'Produto RV',
      flex: 1,
      minWidth: 130,
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
      headerName: 'Preço',
      maxWidth: 130,
      minWidth: 90,
      flex: 1,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'fopw_descricao',
      headerName: 'Fornecedor principal',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'pcpw_descricao',
      headerName: 'Categoria principal',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'cash_descricao',
      headerName: 'Cashback',
      maxWidth: 130,
      flex: 1,
      sortable: true,
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
      maxWidth: 110,
      minWidth: 70,
      sortable: true,
      cellStyle: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { data: PWAProductsProps }) => {
        if (params.data.prpw_max_id) {
          return (
            <div className="flex items-center justify-center gap-2">
              <TextAction>{params.data.prpw_max_id}</TextAction>
              <Icon
                onClick={() => {
                  setIdData(params.data.prpw_max_id)
                  setIsOpenModalMaxProduct(true)
                }}
                className="h-full w-full"
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
      {(isLoading ||
        isFetching ||
        status !== 'success' ||
        fetchStatus !== 'idle') && <Loader />}
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

      {idData && isOpenModalMaxProduct && ProductsMax && (
        <ModalInfoMaxProduct
          open={isOpenModalMaxProduct}
          closeDialog={() => setIsOpenModalMaxProduct(false)}
          id={idData}
          productsMax={ProductsMax}
        />
      )}
    </Container>
  )
}
