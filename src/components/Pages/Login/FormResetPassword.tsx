import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { clearCharacters } from '../../../functions/stringsAndObjects'
import { api } from '../../../libs/api'
import { Button } from '../../Form/Button'
import { InputPassword } from '../../Form/InputPassword'
import { alerta } from '../../System/Alert'
import { TextAction } from '../../Texts/TextAction'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeSlash, FloppyDiskBack } from '@phosphor-icons/react'
import { AxiosError } from 'axios'
import * as yup from 'yup'

interface FormResetPasswordProps {
  onResponse: (data: boolean) => void
  email: string
  codigoValidacao: string
}

interface Inputs {
  senha: string
  confirmPassword: string
}

const schemaReset = yup
  .object({
    senha: yup.string().required('Informe sua senha!'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('senha')], 'As senhas são diferentes')
      .required('Confirme a senha!'),
  })
  .required()

export function FormResetPassword({
  onResponse,
  email,
  codigoValidacao,
}: FormResetPasswordProps) {
  const [passwordView, setPasswordView] = useState(false)
  const [confirmPasswordView, setConfirmPasswordView] = useState(false)
  const formReset = useForm<Inputs>({
    resolver: yupResolver(schemaReset),
  })

  const { handleSubmit } = formReset

  async function onSubmit({ senha }: Inputs) {
    try {
      const payload = {
        login: email,
        codigoValidacao,
        senha,
      }
      const res = await api.post('/users/password_reset', payload)

      const { success, message } = res.data

      if (success) {
        alerta(message, 1)
        onResponse(true)
      } else {
        alerta(message)
        onResponse(false)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alerta(clearCharacters(error.response?.data?.error))
      } else {
        console.error(error)
      }
      onResponse(false)
    }
  }

  function Password() {
    if (passwordView) {
      return (
        <InputPassword.Root name="senha">
          <InputPassword.Input
            type="text"
            name="senha"
            placeholder="Crie uma senha"
          />
          <InputPassword.Icon>
            <Eye
              size={20}
              className="text-black dark:text-white"
              onClick={() => {
                setPasswordView(!passwordView)
              }}
            />
          </InputPassword.Icon>
        </InputPassword.Root>
      )
    } else {
      return (
        <InputPassword.Root name="senha">
          <InputPassword.Input
            type="password"
            name="senha"
            placeholder="Crie uma senha"
          />
          <InputPassword.Icon>
            <EyeSlash
              size={20}
              className="text-black dark:text-white"
              onClick={() => {
                setPasswordView(!passwordView)
              }}
            />
          </InputPassword.Icon>
        </InputPassword.Root>
      )
    }
  }

  function ConfirmPassword() {
    if (confirmPasswordView) {
      return (
        <InputPassword.Root name="confirmPassword">
          <InputPassword.Input
            type="text"
            name="confirmPassword"
            placeholder="Confirme a senha"
          />
          <InputPassword.Icon>
            <Eye
              size={20}
              className="text-black dark:text-white"
              onClick={() => {
                setConfirmPasswordView(!confirmPasswordView)
              }}
            />
          </InputPassword.Icon>
        </InputPassword.Root>
      )
    } else {
      return (
        <InputPassword.Root name="confirmPassword">
          <InputPassword.Input
            type="password"
            name="confirmPassword"
            placeholder="Confirme a senha"
          />
          <InputPassword.Icon>
            <EyeSlash
              size={20}
              className="text-black dark:text-white"
              onClick={() => {
                setConfirmPasswordView(!confirmPasswordView)
              }}
            />
          </InputPassword.Icon>
        </InputPassword.Root>
      )
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-3">
        <TextAction
          size="base"
          className="self-start text-left font-semibold text-black dark:text-white"
        >
          Crie e confirme uma senha nova
        </TextAction>
        <FormProvider {...formReset}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-2"
          >
            {Password()}
            {ConfirmPassword()}
            <Button
              variant="structure"
              className="bg-primary text-white dark:bg-white dark:text-black"
              onClick={handleSubmit(onSubmit)}
            >
              Alterar senha
              <FloppyDiskBack size={18} weight="fill" />
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
