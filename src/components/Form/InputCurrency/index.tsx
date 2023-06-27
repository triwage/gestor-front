import { InputHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import clsx from 'clsx'

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
        className="-mb-0.5 w-full text-sm font-medium text-black dark:text-white"
      >
        {label}
      </label>
      <div
        className={clsx(
          'flex h-10 w-full select-none items-center gap-2 rounded-md border border-gray-300/30 bg-gray/20 transition-all',
          'duration-75 focus-within:border',
          {
            'bg-gray/20 focus-within:border-primary': !props.disabled,
            'bg-gray/40 focus-within:border-white-200/30 dark:bg-white-200/30':
              props.disabled,
          },
        )}
      >
        <span className="inline-flex h-full items-center rounded-l-md border-r border-primary bg-primary px-2 text-sm font-medium text-white">
          R$
        </span>
        <input
          className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg bg-transparent text-sm font-medium text-black outline-none dark:text-white"
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
