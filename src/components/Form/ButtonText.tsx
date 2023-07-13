import { ButtonHTMLAttributes } from 'react'

import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  disable?: boolean
  asChild?: boolean
  variant?: 'primary' | 'structure'
}

export function ButtonText({
  className,
  disable = false,
  asChild,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center gap-2',
        'justify-center',
        'w-full text-sm font-semibold',
        'transition-all hover:opacity-90',
        'underline active:translate-y-0.5 active:opacity-90',
        {
          'pointer-events-none text-white opacity-50': disable,
          'border-none text-primary dark:text-white': variant === 'primary',
          '': variant === 'structure',
        },
        className,
      )}
      {...props}
    />
  )
}
