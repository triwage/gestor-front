import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Dialog } from '../../../components/System/Dialog'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { deleteUser, useUsers } from '../../../services/users'

import { UsersConfigProps } from '../../../@types/users'

import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { PencilSimple, PlusCircle, TrashSimple } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function Users() {
  const queryClient = useQueryClient()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data, isLoading, isFetching } = useUsers()

  const router = useNavigate()

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
      cellRenderer: (params: { data: UsersConfigProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              onClick={() => {
                router('newUser', {
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
            <Icon
              onClick={() => handleDeleteUser(params.data.geus_id)}
              className="w-ful h-full"
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
      field: 'geus_id',
      headerName: 'ID',
      maxWidth: 70,
    },
    {
      field: 'geus_nome',
      headerName: 'Nome',
      flex: 1,
      sortable: true,
      filter: true,
    },
    { field: 'geus_nome_usuario', headerName: 'Username', flex: 1 },
    { field: 'geus_email', headerName: 'Email', flex: 1, sortable: true },
    {
      field: 'geus_admin',
      headerName: 'Admin',
      maxWidth: 90,
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
          return 'Sim'
        } else {
          return 'Não'
        }
      },
    },
  ])

  const { mutateAsync: handleDeleteUser } = useMutation(
    async (userId: number) => {
      const res = await deleteUser(userId)

      if (res) {
        const updateData = data?.filter((e) => e.geus_id !== userId)
        queryClient.setQueryData(['listUsers'], updateData)
      }
    },
  )

  if (isLoading || isFetching) {
    return <Loader />
  }

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Usuários</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('newUser')}>
              <PlusCircle size={18} /> Adicionar usuário
            </Button>
          </div>
        </div>

        <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            animateRows={true}
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
