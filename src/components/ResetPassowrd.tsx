import { useState } from 'react'
import { useNavigate } from 'react-router'

import useConfirm from '../contexts/ConfirmContext'
import { FormResetPassword } from './Pages/Login/FormResetPassword'
import { FormSendEmail } from './Pages/Login/FormSendEmail'
import { FormValidateCode } from './Pages/Login/FormValidateCode'
import { Transition } from '@headlessui/react'
import { X } from '@phosphor-icons/react'

interface ResetPasswordProps {
  isOpen: boolean
  onPress: () => void
}

export function ResetPassword({ isOpen, onPress }: ResetPasswordProps) {
  const [stage, setStage] = useState(1)
  const [email, setEmail] = useState<null | string>(null)
  const [codigoValidacao, setCodigoValidacao] = useState<null | string>(null)

  const router = useNavigate()

  const { Confirm } = useConfirm()

  async function handleCloseModal() {
    const check = await Confirm({
      title: 'Cancelar operação',
      message:
        'Tem certeza que deseja cancelar cancelar a operação de resetar senha?',
    })

    if (check) {
      onPress()
    }
  }

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
      <div
        onClick={handleCloseModal}
        className="fixed -left-2 top-3 z-50 flex w-full justify-end"
      >
        <X size={32} className="cursor-pointer text-white" weight="bold" />
      </div>
      <div className="z-50 flex h-max w-max min-w-[50%] flex-col items-center justify-center gap-1 overflow-auto rounded-lg border border-border bg-white p-6 dark:bg-black">
        {stage === 1 && (
          <FormSendEmail
            onResponse={(res) => {
              setStage(res.value)
              setEmail(res.email)
            }}
          />
        )}
        {stage === 2 && email && (
          <FormValidateCode
            onResponse={(res) => {
              setStage(res.value)
              setCodigoValidacao(res.codigoValidacao)
            }}
            email={email}
          />
        )}

        {stage === 3 && email && codigoValidacao && (
          <FormResetPassword
            onResponse={(res) => {
              if (res) {
                router(-1)
              }
            }}
            email={email}
            codigoValidacao={codigoValidacao}
          />
        )}
      </div>
    </Transition>
  )
}
