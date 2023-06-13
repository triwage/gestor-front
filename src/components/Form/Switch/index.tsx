import { InputHTMLAttributes } from 'react'
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form'

import { getParseMessageError } from '../../../functions/stringsAndObjects'
import { TextAction } from '../../Texts/TextAction'
import { TextBody } from '../../Texts/TextBody'

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  schema?: RegisterOptions<FieldValues, string> | undefined
}

export function Switch({ name, label, schema, ...props }: SwitchProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-max flex-col items-start justify-start gap-0.5">
      <label className="relative mr-5 inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          {...register(name, schema)}
          {...props}
        />
        <div className="after:duration-250 peer h-5 w-9 rounded-full bg-primary-200 after:absolute after:left-[2px] after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-transparent"></div>
        <TextBody className="md-max:uppercase ml-2 select-none font-medium text-black">
          {label}
        </TextBody>
      </label>

      {fieldError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}
