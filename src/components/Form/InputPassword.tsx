import { InputHTMLAttributes, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { getParseMessageError } from '../../functions/stringsAndObjects'
import { TextAction } from '../Texts/TextAction'
import clsx from 'clsx'

export interface InputRootProps {
  children: ReactNode
  label?: string
  name: string
}

function InputRoot({ label, children, name }: InputRootProps) {
  const {
    formState: { errors },
  } = useFormContext()

  const fieldError = getParseMessageError(errors, name)

  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <span className="md-max:uppercase -mb-0.5 w-full text-base font-medium text-black">
        {label}
      </span>
      <div
        className={clsx(
          'flex h-10 w-full select-none items-center gap-3 rounded-md border border-gray-300/30 transition-all',
          'bg-gray/20 duration-75 focus-within:border focus-within:border-primary',
        )}
      >
        {children}
      </div>

      {fieldError && (
        <TextAction size="sm" className="font-semibold text-red">
          {fieldError.message?.toString()}
        </TextAction>
      )}
    </div>
  )
}

interface InputIconProps {
  children: ReactNode
}

function InputIcon(props: InputIconProps) {
  return <div className="mr-2">{props.children}</div>
}

export interface InputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  schema?: any
  className?: string
}

const InputInput = ({ name, schema, className, ...props }: InputInputProps) => {
  const { register } = useFormContext()

  return (
    <input
      className={clsx(
        'h-full w-full appearance-none rounded-md border-none bg-transparent px-3',
        'py-2 text-sm font-medium leading-4 text-black outline-none placeholder:font-normal dark:text-white',
        className,
      )}
      autoComplete="false"
      id={name}
      {...register(name, schema)}
      {...props}
    />
  )
}

export const InputPassword = {
  Root: InputRoot,
  Icon: InputIcon,
  Input: InputInput,
}
