import { FormProvider, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { FloppyDiskBack } from '@phosphor-icons/react'
import * as yup from 'yup'

import { Button } from '../../components/Form/Button'
import { Checkbox } from '../../components/Form/Checkbox'
import { Input } from '../../components/Form/Input'
import { TextHeading } from '../../components/Texts/TextHeading'
import { addNewUser } from '../../services/users'
import { Container } from '../../template/Container'

export interface InputsAddNewUser {
  nomeCompleto: string
  nomeDeUsuario: string
  email: string
  senha: string
  geusAdmin: boolean
}

const schemaUsers = yup
  .object({
    nomeCompleto: yup.string().required('Informe o nome'),
    nomeDeUsuario: yup.string().required('Crie um nome de usuário'),
    email: yup
      .string()
      .email('E-mail inválido')
      .max(255)
      .required('Informe o e-mail'),
    senha: yup.string().required('Crie uma senha'),
    geusAdmin: yup.boolean().required(),
  })
  .required()

export default function NewUser() {
  const formUsers = useForm<InputsAddNewUser>({
    resolver: yupResolver(schemaUsers),
  })
  const { handleSubmit } = formUsers

  async function handleAddNewUser({
    nomeCompleto,
    nomeDeUsuario,
    email,
    senha,
    geusAdmin,
  }: InputsAddNewUser) {
    await addNewUser({ nomeCompleto, nomeDeUsuario, email, senha, geusAdmin })
  }

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <TextHeading>Usuários / Adicionar usuário</TextHeading>
        </div>

        <FormProvider {...formUsers}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleAddNewUser)}
          >
            <div className="flex gap-2">
              <Input name="nomeCompleto" label="Nome" />
              <Input name="nomeDeUsuario" label="Nome de usuário" />
            </div>

            <div className="flex gap-2">
              <Input name="email" label="E-mail" />
              <Input name="senha" type="password" label="Senha" />
            </div>
            <div className="flex gap-2">
              <Checkbox name="geusAdmin" label="Admin" />
            </div>
            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleAddNewUser)}>
                <FloppyDiskBack size={18} weight="fill" /> Adicionar usuário
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
