import { InputHTMLAttributes, ReactNode } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import clsx from 'clsx'

// import { getParseMessageError } from '../../../functions/stringsAndObjects'
// import { TextAction } from '../../Texts/TextAction'

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

  // const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <label
        htmlFor={name}
        className="md-max:uppercase -mb-0.5 w-full text-base font-medium text-black"
      >
        {label}
      </label>
      <div
        className={clsx(
          'flex w-full select-none items-center space-x-3 rounded-md border border-gray-400 bg-transparent transition-all duration-75',
          'h-11 focus-within:border-primary',
          'focus-within:border-2',
          className,
        )}
      >
        <input
          className={clsx(
            'flex h-full w-full flex-1 appearance-none rounded-md border-none bg-transparent px-2 py-1 text-sm font-semibold leading-4 text-black-700 outline-none placeholder:font-normal',
            className,
          )}
          id={name}
          {...register(name, schema)}
          {...props}
        />
      </div>
      {/* {fieldError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )} */}
    </div>
  )
}
