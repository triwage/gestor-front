import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PencilSimple, PlusCircle, TrashSimple } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { UsersConfigProps } from '../../../@types/users'
import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Dialog } from '../../../components/System/Dialog'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { deleteUser, useUsers } from '../../../services/users'
import { Container } from '../../../template/Container'

interface Inputs {
  users: string
}

export default function Users() {
  const queryClient = useQueryClient()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data, isLoading, isFetching } = useUsers()

  const router = useNavigate()
  const formUsers = useForm<Inputs>()
  const { watch } = formUsers

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
              onClick={() => handleDeleteUser(params.data.geusId)}
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
      field: 'geusId',
      headerName: 'ID',
      maxWidth: 70,
    },
    {
      field: 'geusNome',
      headerName: 'Nome',
      flex: 1,
      sortable: true,
      filter: true,
    },
    { field: 'geusNomeUsuario', headerName: 'Username', flex: 1 },
    { field: 'geusEmail', headerName: 'Email', flex: 1, sortable: true },
    {
      field: 'geusAdmin',
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
        const updateData = usuariosFilter?.filter((e) => e.geusId !== userId)
        queryClient.setQueryData(['listUsers'], updateData)
      }
    },
  )

  const usuariosFilter = useMemo(() => {
    if (watch('users') && watch('users') !== 'undefined') {
      const lowerSearch = watch('users').toLowerCase()
      return data?.filter((customer) =>
        customer.geusNome.toLowerCase().includes(lowerSearch),
      )
    }
    return data
  }, [data, watch('users')])

  if (isLoading || isFetching) {
    return <Loader />
  }

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex h-full w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Usuários</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('/config/users/newUser')}>
              <PlusCircle size={18} /> Adicionar usuário
            </Button>
          </div>
        </div>

        <FormProvider {...formUsers}>
          <form className="my-2">
            <Input name="users" label="Pesquisar usuário" />
          </form>
        </FormProvider>

        <div className="ag-theme-alpine h-full w-full">
          <AgGridReact
            rowData={usuariosFilter}
            columnDefs={columnDefs}
            domLayout={'autoHeight'}
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
