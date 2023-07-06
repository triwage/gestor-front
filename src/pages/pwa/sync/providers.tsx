import { useState } from 'react'

import { SyncPWA } from '../../../components/Pages/Sync/Providers/SyncPWA'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { useRVProviders } from '../../../services/rv/providers'

import { RVProvidersProps } from '../../../@types/rv/providers'

import { AgGridTranslation } from '../../../libs/apiGridTranslation'
import { Container } from '../../../template/Container'
import { DeviceMobile } from '@phosphor-icons/react'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function SyncProviders() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [providerAdd, setProviderAdd] = useState<null | RVProvidersProps>(null)

  const { data } = useRVProviders()

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
      cellRenderer: (params: { data: RVProvidersProps }) => {
        return (
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Icon
              onClick={() => {
                setProviderAdd(params.data)
                setIsOpenForm(true)
              }}
              className="h-full w-full"
            >
              <DeviceMobile
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
      field: 'forv_id',
      headerName: 'ID',
      maxWidth: 60,
      sort: 'asc',
    },
    {
      field: 'forv_provider',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: 'forv_logo',
      headerName: 'Logo',
      maxWidth: 70,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellRenderer: (params: { value: string | undefined }) => {
        if (params.value) {
          return <img src={params.value} alt="Logo" width={24} height={24} />
        }
        return '-'
      },
    },
    {
      field: 'pcrv_kind',
      headerName: 'Tipo',
      maxWidth: 150,
      sortable: true,
    },
  ])

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Fornecedores RV</TextHeading>
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

      <SyncPWA
        open={isOpenForm}
        onClosed={() => setIsOpenForm(false)}
        fopw_imagem={providerAdd?.forv_logo}
        fopw_descricao={providerAdd?.forv_descricao}
        fopw_nome={providerAdd?.forv_provider}
        fopw_instrucoes={providerAdd?.forv_instrucoes}
        fopw_termos_condicoes={providerAdd?.forv_termos_condicoes}
        fopw_forv_id={providerAdd?.forv_id}
      />
    </Container>
  )
}
