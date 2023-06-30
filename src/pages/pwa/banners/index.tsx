import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil, PlusCircle } from '@phosphor-icons/react'
import { AgGridReact } from 'ag-grid-react'

interface Inputs {
  banners: string
}

export default function Banners() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)

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
              <NotePencil size={20} weight="fill" className="text-primary" />
            </Icon>
            <Icon
              onClick={() => handleDeleteUser(params.data.geusId)}
              className="w-ful h-full"
            >
              <TrashSimple size={20} weight="fill" className="text-primary" />
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

  const router = useNavigate()
  const formUsers = useForm<Inputs>()
  const { watch } = formUsers

  // const bannersFilter = useMemo(() => {
  //   if (watch('banners') && watch('banners') !== 'undefined') {
  //     const lowerSearch = watch('banners').toLowerCase()
  //     return banners?.filter((customer) =>
  //       customer.title.toLowerCase().includes(lowerSearch),
  //     )
  //   }
  //   return banners
  // }, [watch('banners')])

  return (
    <Container>
      <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
        <TextHeading>Banners</TextHeading>

        <div className="flex items-center">
          <Button onClick={() => router('addBanner')}>
            <PlusCircle size={18} /> Add banner
          </Button>
        </div>
      </div>

      <FormProvider {...formUsers}>
        <form className="my-2">
          <Input name="banners" label="Pesquisar banners" />
        </form>
      </FormProvider>

      <div className="ag-theme-alpine dark:ag-theme-alpine-dark h-full">
        <AgGridReact
          rowData={[]}
          columnDefs={columnDefs}
          domLayout={'autoHeight'}
          animateRows={true}
          gridOptions={{ localeText: AgGridTranslation }}
        />
      </div>
      {/* <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex h-full w-full items-center justify-center">
          <PreviewBanner
            img={bannerPreview?.img}
            subtitle={bannerPreview?.subtitle}
            title={bannerPreview?.title}
          />
        </div>
      </Dialog> */}
    </Container>
  )
}
