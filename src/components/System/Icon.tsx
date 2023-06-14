import { ReactNode } from 'react'

import clsx from 'clsx'

interface IconProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Icon({ children, className, onClick }: IconProps) {
  return (
    <div
      onClick={onClick}
      className={clsx('flex items-center justify-center', className)}
    >
      {children}
    </div>
  )
}
