import { InputHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'
import { TextBody } from '../../Texts/TextBody'

export interface RadioButtonProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  className?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
  messageError?: string | boolean
}

export function RadioButton({
  messageError,
  name,
  label,
  schema,
  ...props
}: RadioButtonProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-max flex-col items-start justify-start gap-0.5">
      <label className="relative mr-5 inline-flex cursor-pointer items-center">
        <input
          className="form-radio h-5 w-5 cursor-pointer text-primary focus:ring-transparent"
          type="radio"
          {...register(name, schema)}
          {...props}
        />
        <TextBody className="ml-1  select-none text-base font-medium text-black ">
          {label}
        </TextBody>
      </label>
      {fieldError && messageError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
