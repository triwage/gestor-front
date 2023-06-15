import { InputHTMLAttributes, ReactNode } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import clsx from 'clsx'

import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string | ReactNode
  className?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
}

export function Input({
  label,
  className,
  name,
  schema,
  ...props
}: InputProps) {
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
        className="flex h-10 w-full select-none items-center gap-3 rounded-md border-gray-300/30 bg-gray/20 transition-all
          duration-75 focus-within:border-2 focus-within:border-primary"
      >
        <input
          className={clsx(
            'h-full w-full appearance-none rounded-md border-none bg-transparent px-3',
            'py-2 text-sm font-medium leading-4 text-black outline-none placeholder:font-normal dark:text-white',
            className,
          )}
          id={name}
          {...register(name, schema)}
          {...props}
        />
      </div>
      {fieldError && (
        <TextAction size="xs" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
