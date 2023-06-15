import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PlusCircle, Sliders, User, UserMinus } from '@phosphor-icons/react'

import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { Dialog } from '../../components/System/Dialog'
import { Dropdown } from '../../components/System/Dropdown'
import { Icon } from '../../components/System/Icon'
import { TextAction } from '../../components/Texts/TextAction'
import { TextBody } from '../../components/Texts/TextBody'
import { TextHeading } from '../../components/Texts/TextHeading'
import { deleteUser } from '../../services/users'
import { Container } from '../../template/Container'

interface Inputs {
  users: string
}

export default function Users() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const router = useNavigate()
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

  async function handleDeleteUser(id: number) {
    await deleteUser(id)
  }

  const usuariosFilter = useMemo(() => {
    if (watch('users') && watch('users') !== 'undefined') {
      const lowerSearch = watch('users').toLowerCase()
      return usuarios?.filter((customer) =>
        customer.nome.toLowerCase().includes(lowerSearch),
      )
    }
    return usuarios
  }, [watch('users')])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Usuários</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('/users/newUser')}>
              <PlusCircle size={18} /> Add usuário
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
                <Icon onClick={() => handleDeleteUser(5)}>
                  <UserMinus size={20} />
                </Icon>
                <Icon onClick={() => setIsOpenModal(true)}>
                  <Sliders size={20} />
                </Icon>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex w-full">sdasda</div>
      </Dialog>
    </Container>
  )
}
