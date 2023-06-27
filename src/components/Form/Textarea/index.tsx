import { TextareaHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
  messageError?: string
}

export function Textarea({ label, name, schema, ...props }: TextareaProps) {
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
        className="border-border-form flex w-full select-none items-center gap-3 rounded-md border border-gray-300/30 bg-gray/20 transition-all duration-75
          focus-within:border focus-within:border-primary"
      >
        <textarea
          className="flex h-full flex-1 appearance-none rounded-md border-none bg-transparent p-1.5 text-sm font-medium leading-4 text-black outline-none placeholder:font-normal dark:text-white"
          id={name}
          {...register(name, schema)}
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
