import { InputHTMLAttributes } from 'react'
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form'

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
            value={value}
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
