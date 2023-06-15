import { InputHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'
import { TextBody } from '../../Texts/TextBody'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
  messageError?: string
}

export function Checkbox({
  messageError,
  name,
  label,
  schema,
  ...props
}: CheckboxProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-max flex-col items-start justify-start gap-0.5">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          className="form-checkbox h-5 w-5 cursor-pointer rounded-md text-primary focus:ring-transparent"
          type="checkbox"
          {...register(name, schema)}
          {...props}
        />
        {label && (
          <TextBody className="ml-2 select-none font-medium text-black ">
            {label}
          </TextBody>
        )}
      </label>
      {fieldError && messageError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
