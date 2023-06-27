import { useCallback, useState } from 'react'

import { Dialog } from '../../components/System/Dialog'
import { TextHeading } from '../../components/Texts/TextHeading'
import useLoading from '../../contexts/LoadingContext'
import { AgGridTranslation } from '../../libs/apiGridTranslation'
import {
  updateRVCategories,
  useRVCategories,
} from '../../services/rv/categories'
import { Container } from '../../template/Container'
import { CellValueChangedEvent, ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export default function RVCategories() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data } = useRVCategories()

  const { setLoading } = useLoading()

  const [columnDefs] = useState<ColDef[]>([
    {
      field: 'pcrv_id',
      headerName: 'ID',
      minWidth: 80,
      maxWidth: 120,
      sort: 'asc',
    },
    {
      field: 'pcrv_kind',
      headerName: 'Nome',
      flex: 1,
      width: 120,
      sortable: true,
      filter: true,
      editable: true,
    },
  ])

  const onCellValueChanged = useCallback(
    async (event: CellValueChangedEvent) => {
      setLoading(true)
      await updateRVCategories(event.data)
      setLoading(false)
    },
    [],
  )

  return (
    <Container>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Categorias RV</TextHeading>
        </div>

        <div className="ag-theme-alpine h-full">
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            animateRows={true}
            onCellValueChanged={onCellValueChanged}
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
