import { ReactNode } from 'react'

import clsx from 'clsx'

interface TextHeadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  children: ReactNode
}

export function TextHeading({
  children,
  size = 'md',
  className,
}: TextHeadingProps) {
  return (
    <h2
      className={clsx(
        'md-max:uppercase select-none',
        {
          'font-black text-black dark:text-white': !className,
          'text-sm': size === 'xs',
          'text-base': size === 'sm',
          'text-lg': size === 'md',
          'text-xl': size === 'lg',
          'text-2xl': size === 'xl',
          'text-3xl': size === '2xl',
        },
        className,
      )}
    >
      {children}
    </h2>
  )
}
