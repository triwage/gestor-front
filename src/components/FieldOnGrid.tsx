import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ICellEditorParams } from 'ag-grid-community'

import { Select } from './Form/Select'

// eslint-disable-next-line react/display-name
const FieldOnGrid = forwardRef((props: ICellEditorParams, ref) => {
  const isActive = (value: string) => value

  const [change, setChange] = useState(isActive(props.value))
  const [editing, setEditing] = useState(true)
  const refContainer = useRef(null)

  const formProducts = useForm()
  const { control } = formProducts

  useEffect(() => {
    focus()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return !!change
      },
    }
  })

  useEffect(() => {
    if (!editing) {
      props.stopEditing()
    }
  }, [editing])

  return (
    <div
      ref={refContainer}
      className="mood"
      tabIndex={1} // important - without this the key presses wont be caught
    >
      <FormProvider {...formProducts}>
        <form>
          <Select
            control={control}
            name="status"
            options={[
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' },
            ]}
            onChange={(event: any) => {
              setEditing(event.value)
              setChange(event.value)
            }}
          />
        </form>
      </FormProvider>
    </div>
  )
})

export { FieldOnGrid }
