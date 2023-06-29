import { FormProvider, useForm } from 'react-hook-form'

import { clearCharacters } from '../../../functions/stringsAndObjects'
import { api } from '../../../libs/api'
import { Button } from '../../Form/Button'
import { Input } from '../../Form/Input'
import { alerta } from '../../System/Alert'
import { TextAction } from '../../Texts/TextAction'
import { yupResolver } from '@hookform/resolvers/yup'
import { SealCheck } from '@phosphor-icons/react'
import { AxiosError } from 'axios'
import * as yup from 'yup'

interface ParamsFunctionResponse {
  codigoValidacao: string | null
  value: number
}

interface FormValidateCodeProps {
  onResponse: (data: ParamsFunctionResponse) => void
  email: string
}

interface Inputs {
  codigoValidacao: string
}

const schemaReset = yup
  .object({
    codigoValidacao: yup.string().required('Informe o código'),
  })
  .required()

export function FormValidateCode({ onResponse, email }: FormValidateCodeProps) {
  const formReset = useForm<Inputs>({
    resolver: yupResolver(schemaReset),
  })

  const { handleSubmit } = formReset

  async function onSubmit({ codigoValidacao }: Inputs) {
    try {
      const payload = {
        login: email,
        codigoValidacao,
      }
      const res = await api.post('/users/password_reset/validate', payload)

      const { success, message } = res.data

      if (success) {
        alerta(message, 1)
        onResponse({ codigoValidacao, value: 3 })
      } else {
        alerta(message)
        onResponse({ codigoValidacao: null, value: 2 })
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alerta(clearCharacters(error.response?.data?.error))
      } else {
        console.error(error)
      }
      onResponse({ codigoValidacao: null, value: 2 })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-11/12 flex-col gap-3">
        <TextAction
          size="base"
          className="self-start text-left font-semibold text-black"
        >
          Informe o código que recebeu no email
        </TextAction>
        <FormProvider {...formReset}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Input name="codigoValidacao" placeholder="Informe o código" />
            <Button onClick={handleSubmit(onSubmit)}>
              Verificar código
              <SealCheck size={18} weight="fill" />
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
