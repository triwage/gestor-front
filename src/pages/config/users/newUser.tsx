import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { yupResolver } from '@hookform/resolvers/yup'
import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'
import * as yup from 'yup'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'
import { addNewUser, updateUser } from '../../../services/users'
import { Container } from '../../../template/Container'

export interface InputsAddNewUser {
  geusId?: number
  geusNome: string
  geusNomeUsuario: string
  geusEmail: string
  geusSenha: string
  geusAdmin: boolean
}

const schemaUsers = yup
  .object({
    geusNome: yup.string().required('Informe o nome'),
    geusNomeUsuario: yup.string().required('Crie um nome de usuário'),
    geusEmail: yup
      .string()
      .email('E-mail inválido')
      .max(255)
      .required('Informe o e-mail'),
    geusSenha: yup.string().required('Crie uma senha'),
    geusAdmin: yup.boolean().required(),
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
    geusId,
    geusNome,
    geusNomeUsuario,
    geusEmail,
    geusSenha,
    geusAdmin,
  }: InputsAddNewUser) {
    if (location.state) {
      await updateUser({
        geusId,
        geusNome,
        geusNomeUsuario,
        geusEmail,
        geusSenha,
        geusAdmin,
      })
    } else {
      await addNewUser({
        geusNome,
        geusNomeUsuario,
        geusEmail,
        geusSenha,
        geusAdmin,
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
              <Input name="geusNome" label="Nome" />
              <Input name="geusNomeUsuario" label="Nome de usuário" />
            </div>

            <div className="flex gap-2">
              <Input name="geusEmail" label="E-mail" autoComplete="new-email" />
              <Input
                name="geusSenha"
                type="password"
                label="Senha"
                autoComplete="new-password"
              />
            </div>
            <div className="flex gap-2">
              <Checkbox name="geusAdmin" label="Admin" />
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
