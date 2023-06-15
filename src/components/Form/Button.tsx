import { ButtonHTMLAttributes } from 'react'

import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  disable?: boolean
  asChild?: boolean
  variant?: 'primary' | 'structure'
}

export function Button({
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
        'h-10 justify-center space-x-2 px-2 py-3',
        'w-full rounded-md border-none text-sm font-semibold',
        'transition-all hover:opacity-90',
        'active:translate-y-0.5 active:opacity-90',
        {
          'pointer-events-none text-white opacity-50': disable,
          'bg-primary text-white': variant === 'primary',
          '': variant === 'structure',
        },
        className,
      )}
      {...props}
    />
  )
}
