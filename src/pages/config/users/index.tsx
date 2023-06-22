import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PlusCircle } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Dialog } from '../../../components/System/Dialog'
import { TextHeading } from '../../../components/Texts/TextHeading'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { deleteUser, useUsers } from '../../../services/users'
import { Container } from '../../../template/Container'

interface Inputs {
  users: string
}

export default function Users() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data, isLoading, isFetching } = useUsers()

  const router = useNavigate()
  const formUsers = useForm<Inputs>()
  const { watch } = formUsers

  const [columnDefs] = useState<ColDef[]>([
    { field: '', headerName: '-', maxWidth: 70 },
    { field: 'geusId', headerName: 'ID', maxWidth: 90 },
    { field: 'geusNome', headerName: 'Nome', flex: 1 },
    { field: 'geusNomeUsuario', headerName: 'Username', flex: 1 },
    { field: 'geusEmail', headerName: 'Email', flex: 1 },
  ])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
      resizable: true,
      cellDataType: false,
    }
  }, [])

  async function handleDeleteUser(id: number) {
    await deleteUser(id)
  }

  const usuariosFilter = useMemo(() => {
    if (watch('users') && watch('users') !== 'undefined') {
      const lowerSearch = watch('users').toLowerCase()
      return data?.filter((customer) =>
        customer.geusNome.toLowerCase().includes(lowerSearch),
      )
    }
    return data
  }, [data, watch('users')])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
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

        <div className="mt-1 flex w-full flex-col gap-1 divide-y divide-gray-300 dark:divide-gray-300/20">
          <div className="ag-theme-alpine h-56 w-full">
            <AgGridReact
              rowData={usuariosFilter}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={{ localeText: AgGridTranslation }}
            />
          </div>
        </div>
      </div>

      <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex w-full">sdasda</div>
      </Dialog>
    </Container>
  )
}
