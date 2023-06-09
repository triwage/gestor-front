import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { usePWACategories } from '../../../services/pwa/categories'

import { PWACategoriesProps } from '../../../@types/pwa/categories'

import { checkIfImage } from '../../../functions/general'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil, PlusCircle } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function PWACategories() {
  const router = useNavigate()

  const { data } = usePWACategories()

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
      cellRenderer: (params: { data: PWACategoriesProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              onClick={() => {
                router('updateCategory', {
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
          </div>
        )
      },
    },
    {
      field: 'pcpw_id',
      headerName: 'ID',
      sort: 'asc',
      maxWidth: 80,
    },
    {
      field: 'pcpw_descricao',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'cash_descricao',
      headerName: 'Cashback',
      minWidth: 80,
      flex: 1,
      sortable: true,
    },
    {
      field: 'pcpw_imagem',
      headerName: 'Imagem',
      maxWidth: 85,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { value: string | undefined }) => {
        const resImage = checkIfImage(params.value)
        if (resImage) {
          return <img src={params.value} alt="Imagem" width={24} height={24} />
        }
        return '-'
      },
    },
    {
      field: 'pcpw_ativo',
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

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Categorias PWA</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('updateCategory')}>
              <PlusCircle size={18} /> Adicionar categoria
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
