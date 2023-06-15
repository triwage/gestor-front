import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

import { getParseMessageError } from '~/functions/stringsAndObjects'

import { TextAction } from '../Texts/TextAction'
import { RadioButton } from './RadioButton'

interface RadioGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  options: { label: string; value: string | number }[]
}

export function RadioGroup({
  name,
  label,
  options,
  ...props
}: RadioGroupProps) {
  const {
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <div className="col w-full gap-0.5">
        <label className="select-none text-base font-medium text-black ">
          {label}
        </label>
        <div className="flex flex-wrap items-center justify-start gap-1">
          {options.map(({ label: optionLabel, value }) => {
            return (
              <RadioButton
                key={optionLabel}
                name={name}
                value={value}
                label={optionLabel}
                messageError={false}
                {...props}
              />
            )
          })}
        </div>
      </div>
      {fieldError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
