import { ReactNode } from 'react'

import clsx from 'clsx'

interface TextActionProps {
  size?: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
  children: ReactNode
}

export function TextAction({
  children,
  size = 'md',
  className,
}: TextActionProps) {
  return (
    <span
      className={clsx(
        ' select-none',
        {
          'font-semibold text-black dark:text-white': !className,
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          'text-3xl': size === '3xl',
          'text-4xl': size === '4xl',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
