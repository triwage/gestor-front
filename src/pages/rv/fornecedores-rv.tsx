import { useCallback, useState } from 'react'

import { PencilSimple } from '@phosphor-icons/react'
import { ColDef, CellValueChangedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Icon } from '../../components/System/Icon'
import { TextHeading } from '../../components/Texts/TextHeading'
import { AgGridTranslation } from '../../libs/apiGridTranslation'
import { useRVProviders } from '../../services/rv/providers'
import { Container } from '../../template/Container'

export default function RVProviders() {
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
              <PencilSimple
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
      cellRenderer: (params) => {
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

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    console.log('Data after change is', event.data)
  }, [])

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
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={17}
            gridOptions={{ localeText: AgGridTranslation }}
          />
        </div>
      </div>
    </Container>
  )
}
