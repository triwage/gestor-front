import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Dialog } from '../../../components/System/Dialog'
import { Dropdown } from '../../../components/System/Dropdown'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { useMaxProducts } from '../../../services/max/products'

import { useMaxProductsStore } from '../../../store/useMaxProductsStore'

import { MaxProductsProps } from '../../../@types/max/products'

import { FormataValorMonetario } from '../../../functions/currency'
import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { NotePencil } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function MaxProducts() {
  const { setCurrentStatus } = useMaxProductsStore()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data } = useMaxProducts()

  const router = useNavigate()

  const optionsFilter = [
    { id: 0, name: 'Todos', value: -1 },
    { id: 1, name: 'Ativos', value: 1 },
    { id: 2, name: 'Inativos', value: 0 },
  ]

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
      cellRenderer: (params: { data: MaxProductsProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              onClick={() => {
                router('updateProduct', {
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
      field: 'id',
      headerName: 'ID',
      maxWidth: 80,
    },
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
      sort: 'asc',
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1,
      filter: true,
    },
    {
      field: 'preco',
      headerName: 'Preço',
      maxWidth: 150,
      sortable: true,
      cellRenderer: (params: { value: boolean }) => {
        return FormataValorMonetario(params.value)
      },
    },
    {
      field: 'imagem_padrao_url',
      headerName: 'Imagem',
      maxWidth: 85,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { value: string | undefined }) => {
        if (params.value) {
          return <img src={params.value} alt="Imagem" width={24} height={24} />
        }
        return '-'
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 80,
      sortable: true,
      cellStyle: (params) => {
        if (params.value === '1') {
          return { color: '#fff', backgroundColor: '#15803d' }
        } else {
          return { color: '#fff', backgroundColor: '#ed3241' }
        }
      },
      cellRenderer: (params: { value: string }) => {
        if (params.value === '1') {
          return 'Ativo'
        } else {
          return 'Inativo'
        }
      },
    },
    {
      field: 'integrado_pwa',
      headerName: 'APP',
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
          <TextHeading>Produtos Max Nível</TextHeading>
        </div>

        <div className="my-1 flex w-full justify-end">
          <Dropdown
            items={optionsFilter}
            name="Filtrar"
            onChange={(res) => setCurrentStatus(res.value)}
          />
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

      <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex w-full">sdasda</div>
      </Dialog>
    </Container>
  )
}
