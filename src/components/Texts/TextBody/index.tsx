import { ReactNode } from 'react'

import clsx from 'clsx'

interface TextBodyProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  children: ReactNode
}

export function TextBody({ children, size = 'md', className }: TextBodyProps) {
  return (
    <span
      className={clsx(
        'md-max:uppercase',
        {
          'font-normal text-black dark:text-white': !className,
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
