import { InputHTMLAttributes, ReactNode } from 'react'
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form'

import PropTypes from 'prop-types'

import { TextAction } from '../../Texts/TextAction'
import { SelectGeneric } from './SelectGeneric'

export interface OptionsSelectProps {
  value: number | string
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
          <TextAction size="sm" className="font-semibold text-red">
            {error?.message}
          </TextAction>
        </div>
      )}
    />
  )
}

Select.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  // eslint-disable-next-line react/require-default-props
  control: PropTypes.any,
  rules: PropTypes.object,
  defaultValue: PropTypes.any,
}

Select.defaultProps = {
  className: '',
  name: '',
  options: [],
  rules: {},
  defaultValue: false,
}
