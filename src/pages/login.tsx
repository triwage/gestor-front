import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/Form/Button'
import { Input } from '../components/Form/Input'

import { Auth, AuthProps } from '../services/auth'

import Logo from '../assets/logo.png'
import useLoading from '../contexts/LoadingContext'

export default function Login() {
  const { setLoading } = useLoading()

  const router = useNavigate()
  const formLogin = useForm<AuthProps>()

  const { handleSubmit } = formLogin

  async function onSubmit({ login, senha }: AuthProps) {
    setLoading(true)
    const res = await Auth({ login, senha })
    setLoading(false)
    if (res) {
      router('/')
    }
  }

  useEffect(() => {
    const loader = async () => {
      const user = localStorage.getItem('token')
      if (user) {
        return router('/')
      }
      return null
    }
    loader()
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-login">
      <div className="grid h-2/3 w-2/3 grid-cols-2 rounded-lg bg-white drop-shadow-2xl">
        {/* Left  */}
        <div className="relative flex items-center justify-center gap-2 overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2">
            <img src={Logo} alt="Logo da triwage" className="h-14 w-14" />
            <span className="font-semibold">Triwage</span>
          </div>

          <div className="absolute bottom-0 right-0 top-0 w-px bg-primary" />
        </div>

        {/* Right */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-3/4 flex-col gap-3">
            <div className="flex flex-col">
              <h2 className="self-start text-left font-semibold text-black">
                Bem vindo
              </h2>
              <span className="self-start text-left text-sm font-medium text-gray-700">
                Informe seu email e senha para acessar o dashboard
              </span>
            </div>
            <FormProvider {...formLogin}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center gap-2"
              >
                <Input name="login" type="email" placeholder="E-mail" />
                <Input name="senha" type="password" placeholder="Senha" />
                <Button onClick={handleSubmit(onSubmit)}>Entrar</Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
