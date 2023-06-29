import { FormProvider, useForm } from 'react-hook-form'

import { clearCharacters } from '../../../functions/stringsAndObjects'
import { api } from '../../../libs/api'
import { Button } from '../../Form/Button'
import { Input } from '../../Form/Input'
import { alerta } from '../../System/Alert'
import { TextAction } from '../../Texts/TextAction'
import { yupResolver } from '@hookform/resolvers/yup'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { AxiosError } from 'axios'
import * as yup from 'yup'

interface ParamsFunctionResponse {
  email: string | null
  value: number
}

interface FormSendEmailProps {
  onResponse: (data: ParamsFunctionResponse) => void
}

interface Inputs {
  login: string
}

const schemaReset = yup
  .object({
    login: yup
      .string()
      .email('E-mail inválido')
      .max(255)
      .required('Informe o e-mail'),
  })
  .required()

export function FormSendEmail({ onResponse }: FormSendEmailProps) {
  const formReset = useForm<Inputs>({
    resolver: yupResolver(schemaReset),
  })

  const { handleSubmit } = formReset

  async function onSubmit({ login }: Inputs) {
    try {
      const res = await api.post('/users/password_reset/start', login)

      const { success, message } = res.data

      if (success) {
        alerta(message, 1)
        onResponse({ email: login, value: 2 })
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alerta(clearCharacters(error.response?.data?.error))
      } else {
        console.error(error)
      }
      onResponse({ email: null, value: 1 })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-11/12 flex-col gap-3">
        <div className="flex flex-col">
          <TextAction
            size="base"
            className="self-start text-left font-bold text-black"
          >
            Esqueceu sua senha?
          </TextAction>
          <TextAction
            size="sm"
            className="-mt-1 self-start text-left font-normal text-black"
          >
            Digite o seu e-mail para redefinir sua senha
          </TextAction>
        </div>
        <FormProvider {...formReset}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Input name="login" placeholder="E-mail" />
            <Button onClick={handleSubmit(onSubmit)}>
              Enviar código
              <PaperPlaneTilt size={18} weight="fill" />
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
