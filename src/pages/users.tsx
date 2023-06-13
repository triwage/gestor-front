import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { PencilSimple, Plus, User, UserMinus } from '@phosphor-icons/react'

import { Button } from '../components/Form/Button'
import { Input } from '../components/Form/Input'
import { Dropdown } from '../components/System/Dropdown'
import { TextAction } from '../components/Texts/TextAction'
import { TextBody } from '../components/Texts/TextBody'
import { TextHeading } from '../components/Texts/TextHeading'
import { Container } from '../template/Container'

interface Inputs {
  users: string
}

export default function Users() {
  const formUsers = useForm<Inputs>()

  const { watch } = formUsers

  const usuarios = [
    {
      nome: 'fulano de tal',
      cargo: 'Admin',
      email: 'email@gmail.com',
    },
    {
      nome: 'francisco',
      cargo: 'Admin',
      email: 'email@gmail.com',
    },
    {
      nome: 'joão',
      cargo: 'Admin',
      email: 'email@gmail.com',
    },
    {
      nome: 'matheus',
      cargo: 'Admin',
      email: 'email@gmail.com',
    },
    {
      nome: 'bruno',
      cargo: 'Admin',
      email: 'email@gmail.com',
    },
  ]

  const optionsDropdown = [
    { id: 1, name: 'Admin', value: 0 },
    { id: 2, name: 'Funcionário', value: 0 },
  ]

  const usuariosFilter = useMemo(() => {
    if (watch('users') && watch('users') !== 'undefined') {
      const lowerSearch = watch('users').toLowerCase()
      return usuarios?.filter((customer) =>
        customer.nome.toLowerCase().includes(lowerSearch),
      )
    }
    return usuarios
  }, [watch('users')])

  console.log(usuariosFilter)

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Usuários</TextHeading>

          <div className="flex items-center">
            <Button>
              <Plus size={20} /> Add usuário
            </Button>
          </div>
        </div>

        <FormProvider {...formUsers}>
          <form className="my-2">
            <Input name="users" label="Pesquisar usuário" />
          </form>
        </FormProvider>

        <div className="mt-1 flex w-full flex-col gap-1 divide-y divide-gray-300 dark:divide-gray-300/20">
          {!usuariosFilter ||
            (usuariosFilter.length === 0 && (
              <TextBody
                size="sm"
                className="text-center font-semibold text-black dark:text-white"
              >
                Nenhum usuário encontrado!
              </TextBody>
            ))}
          {usuariosFilter.map((item, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between rounded-md py-1"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-lg bg-gray-300 p-1 text-black">
                  <User size={16} />
                </div>

                <TextAction
                  size="sm"
                  className="font-medium text-black dark:text-white"
                >
                  {item.nome}
                </TextAction>
                <TextAction size="xs" className="font-normal text-gray-500">
                  {item.email}
                </TextAction>
              </div>
              <div className="flex items-center gap-3">
                <Dropdown
                  items={optionsDropdown}
                  onChange={(item) => console.log(item)}
                  name={item.cargo}
                />
                <UserMinus size={20} />
                {/* <PencilSimple size={20} /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
