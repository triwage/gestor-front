import { Button } from '../Form/Button'
import { Text } from '../Texts/Text'
import { Transition } from '@headlessui/react'

export interface ModalConfirmProps {
  isOpen?: boolean
  title?: string
  message: string
  confirm?: string
  cancel?: string
  onConfirm?: () => void
  onClose?: () => void
}

export function ModalConfirm({
  isOpen,
  title = 'Confirmação',
  confirm = 'Continuar',
  cancel = 'Cancelar',
  message,
  onConfirm,
  onClose,
}: ModalConfirmProps) {
  return (
    <Transition
      className="fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-opacity"
      show={isOpen}
      enter="transition-all ease-in-out duration-75 delay-75"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex h-max w-max min-w-[45%] max-w-fit flex-col items-center justify-center gap-1 overflow-auto rounded-lg border border-border bg-white px-6 py-4 dark:bg-black">
        <Text
          size="lg"
          className="w-full text-left font-semibold text-black dark:text-white-800"
        >
          {title}
        </Text>
        <div className="mt-2 flex w-full flex-col gap-2 rounded-md bg-white dark:bg-black">
          <Text
            className="text-left font-normal text-black dark:text-gray-300"
            size="md"
          >
            {message}
          </Text>
          <div className="mt-4 flex w-1/3 items-center gap-4 self-end">
            <Button
              onClick={onClose}
              className="border border-black bg-white text-black dark:border-border-500 dark:bg-black dark:text-white"
              variant="structure"
            >
              {cancel}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-primary text-white dark:bg-white dark:text-black"
              variant="structure"
            >
              {confirm}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  )
}
