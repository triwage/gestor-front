import { toast } from 'react-toastify'

import { CheckCircle, Info, SealWarning, XCircle } from '@phosphor-icons/react'

import { Notification } from './Notification'

const toastOptionsError = {
  autoClose: 2500,
  draggable: true,
  position: toast.POSITION.TOP_CENTER,
  newestOnTop: true,
  icon: <XCircle size={22} weight="fill" className="text-white" />,
}

const toastOptionsSuccess = {
  autoClose: 2500,
  draggable: true,
  position: toast.POSITION.TOP_CENTER,
  newestOnTop: true,
  icon: <CheckCircle size={22} weight="fill" className="text-white" />,
}

const toastOptionsWarning = {
  autoClose: 2500,
  draggable: true,
  position: toast.POSITION.TOP_CENTER,
  newestOnTop: true,
  icon: <SealWarning size={22} weight="fill" className="text-black" />,
}

const toastOptionsInfo = {
  autoClose: 2500,
  draggable: true,
  position: toast.POSITION.TOP_CENTER,
  newestOnTop: true,
  icon: <Info size={22} weight="fill" className="text-white" />,
}

export function alerta(mensagem: string, tipoMensagem?: 1 | 2 | 3 | 4) {
  /*
    1 - mensagem sucesso
    2 - mensagem error
    3 - mensagem info
    4 - mensagem aviso
  */

  switch (tipoMensagem) {
    case 1:
      toast.success(
        <Notification description={mensagem} />,
        toastOptionsSuccess,
      )
      break
    case 2:
      toast.error(<Notification description={mensagem} />, toastOptionsError)
      break
    case 3:
      toast.info(<Notification description={mensagem} />, toastOptionsInfo)
      break
    case 4:
      toast.warn(<Notification description={mensagem} />, toastOptionsWarning)
      break
    default:
      toast.error(<Notification description={mensagem} />, toastOptionsError)
    // code block
  }
}
