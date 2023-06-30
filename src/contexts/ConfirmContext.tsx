// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

import {
  ModalConfirm,
  ModalConfirmProps,
} from '../components/System/ModalConfirm'

interface ConfirmDialogContextProps {
  Confirm: (data: ModalConfirmProps) => Promise<boolean>
}

const ConfirmDialog = createContext({} as ConfirmDialogContextProps)

type ConfirmProviderProps = {
  children: ReactNode
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, setState] = useState<ModalConfirmProps>()
  const fn = useRef<any>()

  const Confirm = useCallback(
    (data: ModalConfirmProps) => {
      return new Promise((resolve) => {
        setState({ ...data, isOpen: true })
        fn.current = (choice: boolean) => {
          resolve(choice)
          setState({ ...data, isOpen: false })
        }
      })
    },
    [setState],
  )

  return (
    <ConfirmDialog.Provider value={{ Confirm }}>
      {children}
      <ModalConfirm
        isOpen={!!state?.isOpen}
        title={state?.title ?? ''}
        confirm={state?.confirm}
        cancel={state?.cancel}
        message={state?.message ?? ''}
        onClose={() => fn.current(false)}
        onConfirm={() => fn.current(true)}
      />
    </ConfirmDialog.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useConfirm() {
  return useContext(ConfirmDialog)
}
