import { ReactNode } from 'react'

import clsx from 'clsx'

interface IconProps {
  children: ReactNode
  className?: string
  click?: boolean
  onClick?: () => void
}

export function Icon({
  children,
  className,
  onClick,
  click = false,
}: IconProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center',
        {
          onPress: click,
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
