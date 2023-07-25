import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import {
  deletePWAProvider,
  usePWAProviders,
} from '../../../services/pwa/providers'

import { PWAProvidersProps } from '../../../@types/pwa/providers'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil, PlusCircle, TrashSimple } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function PWAProviders() {
  const queryClient = useQueryClient()
  const router = useNavigate()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const { data, isLoading, isFetching } = usePWAProviders()

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
      cellRenderer: (params: { data: PWAProvidersProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-2">
            <Icon
              onClick={() => {
                router('updateProvider', {
                  state: params.data,
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
              onClick={() => handleDeleteCategory(params.data.fopw_id)}
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
      field: 'fopw_id',
      headerName: 'ID',
      sort: 'asc',
      maxWidth: 80,
    },
    {
      field: 'fopw_nome',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'fopw_descricao',
      headerName: 'Descrição',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'fopw_instrucoes',
      headerName: 'Instruções',
      minWidth: 90,
      flex: 1,
      sortable: true,
    },
    {
      field: 'fopw_imagem',
      headerName: 'Imagem',
      maxWidth: 85,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { value: string | undefined }) => {
        const resImage = new Image()
        if (params?.value) {
          resImage.src = params?.value
          resImage.onload = function () {
            return (
              <img src={params.value} alt="Imagem" width={24} height={24} />
            )
          }
          resImage.onerror = function () {
            return '-'
          }
        } else {
          return '-'
        }
      },
    },
    {
      field: 'fopw_ativo',
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
  ])

  const { mutateAsync: handleDeleteCategory } = useMutation(
    async (id: number) => {
      const check = await Confirm({
        title: 'Excluir fornecedor',
        message: 'Tem certeza que deseja excluir esse fornecedor?',
      })

      if (check) {
        setLoading(true)
        const res = await deletePWAProvider(id)

        if (res) {
          const updateData = data?.filter((e) => e.fopw_id !== id)
          queryClient.setQueryData(['PWAProviders'], updateData)
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
          <TextHeading>Fornecedores PWA</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('updateProvider')}>
              <PlusCircle size={18} /> Adicionar fornecedor
            </Button>
          </div>
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
    </Container>
  )
}
