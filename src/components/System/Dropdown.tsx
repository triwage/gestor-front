import { Fragment, useState } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { CaretDown } from '@phosphor-icons/react'
import clsx from 'clsx'

export interface ItemsProps {
  id: number
  name: string
  value: number
}

interface DropdownProps {
  items: ItemsProps[]
  onChange: (arg0: ItemsProps) => void
  className?: string
  name: string
}

export function Dropdown({ items, onChange, className, name }: DropdownProps) {
  const [nameDropdown, setNameDropdown] = useState(name)

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex h-9 w-full items-center justify-center gap-1 rounded-md bg-primary px-2 py-2.5 text-xs font-normal text-white">
            <span className="xs-max:hidden truncate text-xs font-medium">
              {nameDropdown}
            </span>
            <CaretDown size={16} className="xs-max:hidden" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition-all ease-in-out duration-150 delay-100"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items
            className={clsx(
              'shadow-card absolute right-0 z-40 mt-0.5 w-full origin-top-right rounded-sm border border-primary/40 bg-white',
              className,
            )}
          >
            <div className="w-full divide-y divide-border px-1 py-1">
              {items?.map((item) => (
                <Menu.Item key={item.id} as={Fragment}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        onChange(item)
                        setNameDropdown(item.name)
                      }}
                      type="button"
                      className={`${
                        active
                          ? 'bg-primary text-white'
                          : 'text-gray-900 dark:text-black'
                      } group flex w-full items-center justify-end space-x-1 rounded-sm p-2 text-xs font-medium transition-all duration-100`}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
