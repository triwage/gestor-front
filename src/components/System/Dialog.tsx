import { ReactNode } from 'react'

import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'

interface DialogProps {
  open: boolean
  closeDialog: () => void
  children: ReactNode
}

export function Dialog({ open, closeDialog, children }: DialogProps) {
  return (
    <Transition
      className="fixed left-0 top-0 flex h-full w-full items-center justify-center"
      show={open}
      enter="transform transition duration-150"
      enterFrom="opacity-0 scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <Transition
        onClick={closeDialog}
        className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-opacity"
        show={open}
        enter="transition-all ease-in-out duration-75 delay-75"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      />
      <div className="z-50 flex min-h-[75%] min-w-[75%] flex-col items-center gap-1 rounded-md bg-white p-1 shadow-sm shadow-white">
        <div className="flex w-full justify-end">
          <X
            size={22}
            className="cursor-pointer text-primary"
            onClick={closeDialog}
          />
        </div>
        <div className="mt-2 h-full w-full">{children}</div>
      </div>
    </Transition>
  )
}
