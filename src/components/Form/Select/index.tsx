import { InputHTMLAttributes, ReactNode } from 'react'
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form'

import { TextAction } from '../../Texts/TextAction'
import { SelectGeneric } from './SelectGeneric'

export interface OptionsSelectProps {
  value: number | string | boolean
  label: string
}

export interface SelectProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  control: any
  options: OptionsSelectProps[] | []
  className?: string
  label?: string | ReactNode
  schema?: RegisterOptions<FieldValues, string> | undefined
}

export function Select({
  name,
  control,
  options,
  className,
  schema,
  label,
  ...props
}: SelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={schema}
      render={({
        field: { onChange, onBlur, ref, name, value },
        fieldState: { error },
      }) => (
        <div className="flex w-full flex-col items-start justify-start gap-0.5">
          <SelectGeneric
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            inputRef={ref}
            className={className}
            options={options}
            label={label}
            {...props}
          />
          <TextAction size="xs" className="font-semibold text-red">
            {error?.message}
          </TextAction>
        </div>
      )}
    />
  )
}
