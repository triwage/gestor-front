import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import clsx from 'clsx'

interface MenuProps {
  name: string
  route?: string
  icon: ReactNode
  isOpen: boolean
  onClick: () => void
}

export function Menu({ name, icon, isOpen, onClick, route }: MenuProps) {
  const location = useLocation()

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
        {
          'justify-start': isOpen,
          'justify-center': !isOpen,
          ' bg-primary/20 dark:bg-black/40': location.pathname === route,
        },
      )}
    >
      <div className="flex items-center justify-center text-center">{icon}</div>
      <span
        className={clsx(
          'select-none text-base font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
          {
            'invisible hidden': !isOpen,
          },
        )}
      >
        {name}
      </span>
    </div>
  )
}
