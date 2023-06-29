import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { addNewUser, updateUser } from '../../../services/users'

import { Container } from '../../../template/Container'
import { yupResolver } from '@hookform/resolvers/yup'
import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'
import * as yup from 'yup'

export interface InputsAddNewUser {
  geus_id?: number
  geus_nome: string
  geus_nome_usuario: string
  geus_email: string
  geus_senha?: string
  geus_admin: boolean
}

const schemaUsers = yup
  .object({
    geus_nome: yup.string().required('Informe o nome'),
    geus_nome_usuario: yup.string().required('Crie um nome de usuário'),
    geus_email: yup
      .string()
      .email('E-mail inválido')
      .max(255)
      .required('Informe o e-mail'),
    geus_admin: yup.boolean().required(),
  })
  .required()

export default function NewUser() {
  const formUsers = useForm<InputsAddNewUser>({
    resolver: yupResolver(schemaUsers),
  })
  const { handleSubmit, setValue } = formUsers

  const router = useNavigate()
  const location = useLocation()

  async function handleAddNewUser({
    geus_admin,
    geus_email,
    geus_nome,
    geus_nome_usuario,
    geus_senha,
    geus_id,
  }: InputsAddNewUser) {
    if (location.state) {
      await updateUser({
        geus_admin,
        geus_email,
        geus_nome,
        geus_nome_usuario,
        geus_senha,
        geus_id,
      })
    } else {
      await addNewUser({
        geus_admin,
        geus_email,
        geus_nome,
        geus_nome_usuario,
        geus_senha,
      })
    }
  }

  useEffect(() => {
    if (location.state) {
      const userEdit = Object.keys(location.state)

      userEdit?.forEach((user) => {
        // @ts-expect-error
        setValue(String(user), location.state[user])
      })
    }
  }, [location])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Usuários / Adicionar usuário</TextHeading>
          </div>
        </div>

        <FormProvider {...formUsers}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleAddNewUser)}
          >
            <div className="flex gap-2">
              <Input name="geus_nome" label="Nome" />
              <Input name="geus_nome_usuario" label="Nome de usuário" />
            </div>

            <div className="flex gap-2">
              <Input
                name="geus_email"
                label="E-mail"
                autoComplete="new-email"
              />
              <Input
                type="password"
                name="geus_senha"
                label="Senha"
                autoComplete="new-password"
              />
            </div>
            <div className="flex gap-2">
              <Checkbox name="geus_admin" label="Admin" />
            </div>
            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleAddNewUser)}>
                <FloppyDiskBack size={18} weight="fill" />
                {location.state ? 'Atualizar usuário' : 'Adicionar usuário'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
