import { TextareaHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { TextAction } from '~/components/Texts/TextAction'

import { getParseMessageError } from '~/functions/stringsAndObjects'

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
      <label htmlFor={name} className="w-full text-base font-medium text-black">
        {label}
      </label>
      <div
        className="border-border-form -mt-[5px] flex w-full select-none items-center gap-3 rounded-md border bg-white transition-all duration-75
          focus-within:border focus-within:border-primary"
      >
        <textarea
          className="flex h-full flex-1 appearance-none rounded-[5px] border-none bg-transparent p-1.5 text-base font-medium leading-4 outline-none placeholder:font-normal"
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
