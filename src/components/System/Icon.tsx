import { ReactNode } from 'react'

import clsx from 'clsx'

interface IconProps {
  children: ReactNode
  className?: string
  title?: string
  onClick?: () => void
}

export function Icon({ title, children, className, onClick }: IconProps) {
  return (
    <div
      title={title}
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center',
        {
          'cursor-pointer transition-all active:translate-y-0.5': onClick,
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
