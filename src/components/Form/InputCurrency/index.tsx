import { InputHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { formatarMoeda } from '../../../functions/currency'
import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'

export interface InputCurrencyProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  className?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
}

export function InputCurrency({
  label,
  className,
  name,
  schema,
  ...props
}: InputCurrencyProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <label
        htmlFor={name}
        className="-mb-0.5 w-full text-base font-medium text-black "
      >
        {label}
      </label>
      <div className="flex h-9 w-full rounded-md border border-border-form transition-all duration-75 focus-within:border-2 focus-within:border-primary">
        <span className="inline-flex items-center rounded-l-md border-r border-border-form bg-gray-200 px-[10px] text-base font-medium text-black-700">
          R$
        </span>
        <input
          className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg bg-transparent p-2 text-base font-medium outline-none "
          id={name}
          {...register(name, {
            onChange: (event) => {
              event.target.value = formatarMoeda(event.target.value)
            },
          })}
          {...props}
        />
      </div>
      {fieldError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
