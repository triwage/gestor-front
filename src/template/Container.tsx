import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Sidebar } from '../components/Sidebar'
import { alerta } from '../components/System/Alert'

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  const router = useNavigate()

  useEffect(() => {
    // const loader = async () => {
    //   const user = localStorage.getItem('token')
    //   if (!user) {
    //     alerta('Usuário sem permissão')
    //     return router('/login')
    //   }
    //   return null
    // }
    // loader()
  }, [])

  return (
    <main className="flex h-screen w-screen text-primary dark:text-white">
      <Sidebar />
      <div className="h-full w-full bg-white p-2 dark:bg-black-700">
        {children}
      </div>
    </main>
  )
}
