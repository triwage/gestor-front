import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import {
  deletePWACashback,
  usePWACashback,
} from '../../../services/pwa/cashback'

import { PWACashbackProps } from '../../../@types/pwa/cashback'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil, PlusCircle, TrashSimple } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function PWACashback() {
  const queryClient = useQueryClient()
  const router = useNavigate()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const { data, isLoading, isFetching } = usePWACashback()

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
      cellRenderer: (params: { data: PWACashbackProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-2">
            <Icon
              onClick={() => {
                router('updateCashback', {
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
              onClick={() => handleDeleteCashback(params.data.cash_id)}
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
      field: 'cash_id',
      headerName: 'ID',
      sort: 'asc',
      maxWidth: 80,
    },
    {
      field: 'cash_descricao',
      headerName: 'Nome',
      minWidth: 80,
      flex: 1,
      sortable: true,
    },
    {
      field: 'cash_valor',
      headerName: 'Valor',
      maxWidth: 130,
      flex: 1,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'cash_ativo',
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

  const { mutateAsync: handleDeleteCashback } = useMutation(
    async (id: number) => {
      const check = await Confirm({
        title: 'Excluir cashback',
        message: 'Tem certeza que deseja excluir esse cashback?',
      })

      if (check) {
        setLoading(true)
        const res = await deletePWACashback(id)

        if (res) {
          const updateData = data?.filter((e) => e.cash_id !== id)
          queryClient.setQueryData(['PWACashback'], updateData)
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
          <TextHeading>Cashback PWA</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('updateCashback')}>
              <PlusCircle size={18} /> Adicionar cashback
            </Button>
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
    </Container>
  )
}
