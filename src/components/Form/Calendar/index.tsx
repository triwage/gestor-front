import { InputHTMLAttributes } from 'react'
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form'

import { parseISO } from 'date-fns'

import { useCurrentPanelInfoStore } from '~/store/useCurrentPanelInfoStore'

import { TextAction } from '../../Texts/TextAction'
import { InputCalendar } from './Calendar'

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  control: any
  setDefaultValue?: boolean
  minDate?: any
  maxDate?: any
  label?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
}

export function DateInput({
  name,
  control,
  minDate,
  maxDate,
  label,
  setDefaultValue,
  schema,
  ...props
}: DateInputProps) {
  const { currentDate } = useCurrentPanelInfoStore()
  return (
    <Controller
      control={control}
      name={name}
      rules={schema}
      {...props}
      render={({
        field: { onChange, onBlur, name, value = new Date() },
        fieldState: { error },
      }) => (
        <div className="flex w-full flex-col items-start justify-start gap-1">
          <InputCalendar
            value={setDefaultValue ? parseISO(String(currentDate)) : value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            minDate={minDate}
            maxDate={maxDate}
            label={label}
            {...props}
          />
          <TextAction size="sm" className="-mt-[2px] font-semibold text-red">
            {error?.message}
          </TextAction>
        </div>
      )}
    />
  )
}
