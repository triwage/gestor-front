import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PencilSimple } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { Dialog } from '../../components/System/Dialog'
import { Icon } from '../../components/System/Icon'
import { TextHeading } from '../../components/Texts/TextHeading'
import { AgGridTranslation } from '../../libs/apiGridTranslation'
import { useRVCategories } from '../../services/rv/categories'
import { Container } from '../../template/Container'

interface Inputs {
  categories: string
}

export default function RVCategories() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data } = useRVCategories()

  const router = useNavigate()
  const formProducts = useForm<Inputs>()
  const { watch } = formProducts

  const [columnDefs] = useState<ColDef[]>([
    {
      field: '',
      maxWidth: 40,
      lockVisible: true,
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              // onClick={() => {
              //   router('newUser', {
              //     state: params.data,
              //   })
              // }}
              className="h-full w-full"
            >
              <PencilSimple size={20} weight="fill" className="text-primary" />
            </Icon>
          </div>
        )
      },
    },
    {
      field: 'pcrv_id',
      headerName: 'ID',
      maxWidth: 60,
    },
    {
      field: 'pcrv_kind',
      headerName: 'Tipo',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
  ])

  const categoriesFilter = useMemo(() => {
    if (watch('categories') && watch('categories') !== 'undefined') {
      const lowerSearch = watch('categories').toLowerCase()
      return data?.filter((p) =>
        p.prrv_nome.toLowerCase().includes(lowerSearch),
      )
    }
    return data
  }, [watch('categories'), data])

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Categorias RV</TextHeading>
        </div>

        {/* <FormProvider {...formProducts}>
          <form className="my-1">
            <Input name="products" label="Pesquisar produto" />
          </form>
        </FormProvider> */}
        <div className="ag-theme-alpine h-full">
          <AgGridReact
            rowData={categoriesFilter}
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
