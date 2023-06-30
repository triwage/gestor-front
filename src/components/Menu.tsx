import { ReactNode, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { MenusProps } from '../@types/menus'

import { Transition } from '@headlessui/react'
import clsx from 'clsx'

interface MenuProps {
  show: boolean | number
  onClick: (item: MenusProps) => void
  menu?: MenusProps
  icon?: ReactNode
  name?: string
}

export function Menu({ name, menu, show, icon, onClick }: MenuProps) {
  const [itensExpandir, setItensExpandir] = useState<number | null>(null)
  const location = useLocation()

  function subMenus(menu: MenusProps, expandir: number) {
    if (menu?.ITENS?.length > 0) {
      return (
        <Menu menu={menu} show={expandir} onClick={(value) => onClick(value)} />
      )
    }
  }

  function handleExpandir(menu: MenusProps) {
    const itensExpandirAux = itensExpandir !== menu.geme_id ? menu.geme_id : -1

    setItensExpandir(itensExpandirAux)
  }

  return (
    <Transition
      className="flex w-full items-center pl-3"
      show={show === menu?.geme_id || !!name}
      enter="transition-all ease-in-out duration-75 delay-75"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="col w-full space-y-1">
        {menu?.ITENS?.map((element) => (
          <div
            key={element.geme_id}
            onClick={() => {
              handleExpandir(element)
              onClick(element)
            }}
            className={clsx(
              'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
              {
                'justify-start': show,
                'justify-center': !show,
                ' bg-primary/20 dark:bg-black/40':
                  location.pathname === element.geme_url,
              },
            )}
          >
            <div className="flex items-center justify-center text-center">
              {icon && icon}
              {!icon && element.geme_icone && (
                <img
                  src={element.geme_icone}
                  alt={element.geme_descricao}
                  className="h-5 w-5"
                />
              )}
            </div>
            <span
              className={clsx(
                'select-none text-sm font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
                {
                  'invisible hidden': !show,
                },
              )}
            >
              {name && name}
              {!name && element.geme_descricao}
            </span>
            {subMenus(element, Number(itensExpandir))}
          </div>
        ))}
      </div>
    </Transition>
  )
}
