import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { LeftBar } from '../../components/Pages/Login/LeftBar'
import { ResetPassword } from '../../components/ResetPassowrd'
import { TextAction } from '../../components/Texts/TextAction'

import { Auth, AuthProps } from '../../services/auth'

import useLoading from '../../contexts/LoadingContext'
import { LockSimpleOpen } from '@phosphor-icons/react'

export default function Login() {
  const [modalResetPassword, setModalResetPassword] = useState(false)

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
        <LeftBar />

        {/* Right */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-11/12 flex-col gap-3">
            <div className="flex flex-col">
              <TextAction
                size="md"
                className="self-start text-left font-bold text-black"
              >
                Bem vindo
              </TextAction>
              <TextAction
                size="sm"
                className="-mt-1 self-start text-left font-normal text-black"
              >
                Informe seu email e senha para acessar o dashboard
              </TextAction>
            </div>
            <FormProvider {...formLogin}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center gap-2"
              >
                <Input name="login" type="email" placeholder="E-mail" />
                <Input name="senha" type="password" placeholder="Senha" />

                <div
                  onClick={() => setModalResetPassword(true)}
                  className="onPress self-end "
                >
                  <TextAction
                    size="xs"
                    className="font-medium text-primary underline"
                  >
                    Esqueceu sua senha?
                  </TextAction>
                </div>
                <Button onClick={handleSubmit(onSubmit)}>
                  Entrar
                  <LockSimpleOpen size={18} weight="fill" />
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>

      <ResetPassword
        isOpen={modalResetPassword}
        onPress={() => setModalResetPassword(false)}
      />
    </div>
  )
}
