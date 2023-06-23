import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

import { Loader } from '../components/System/Loader'

interface LoadingContextProps {
  setLoading: (state: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextProps)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState(false)

  const setLoading = useCallback(
    (state: boolean) => {
      setLoadingState(state)
    },
    [setLoadingState],
  )

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {loadingState && <Loader />}
    </LoadingContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useLoading() {
  return useContext(LoadingContext)
}
