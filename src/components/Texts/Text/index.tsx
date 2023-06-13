import { ReactNode } from 'react'

import clsx from 'clsx'

interface TextProps {
  size?: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  children: ReactNode
}

export function Text({ children, size = 'sm', className }: TextProps) {
  return (
    <span
      className={clsx(
        'select-none',
        {
          'font-semibold  text-black dark:text-white': !className,
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          'text-3xl': size === '3xl',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
