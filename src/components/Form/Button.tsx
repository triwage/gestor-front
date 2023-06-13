import { ButtonHTMLAttributes } from 'react'

import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  disable?: boolean
  asChild?: boolean
  variant?: 'primary' | 'secondary' | 'confirm' | 'comprovant' | 'outline'
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
        'justify-center space-x-2 px-1 py-3',
        'w-full rounded-md border-none text-sm font-semibold',
        'transition-all hover:opacity-90',
        'active:translate-y-0.5 active:opacity-90',
        {
          'pointer-events-none h-12 text-white opacity-50': disable,
          'h-9 bg-primary text-white': variant === 'primary',
          'h-9 w-[96px] px-1 py-4 font-medium text-white':
            variant === 'secondary',
        },
        className,
      )}
      {...props}
    />
  )
}
