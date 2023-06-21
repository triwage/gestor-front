import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { PencilSimpleLine, PlusCircle, User } from '@phosphor-icons/react'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Dialog } from '../../../components/System/Dialog'
import { Icon } from '../../../components/System/Icon'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextBody } from '../../../components/Texts/TextBody'
import { TextHeading } from '../../../components/Texts/TextHeading'
// import { deleteUser } from '../../../services/users'
import { Container } from '../../../template/Container'

interface Inputs {
  categories: string
}

export default function Categories() {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const router = useNavigate()
  const formCategories = useForm<Inputs>()
  const { watch } = formCategories

  const categories = [
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

  // async function handleDeleteProduct(id: number) {
  //   await deleteUser(id)
  // }

  const categoriesFilter = useMemo(() => {
    if (watch('categories') && watch('categories') !== 'undefined') {
      const lowerSearch = watch('categories').toLowerCase()
      return categories?.filter((p) =>
        p.nome.toLowerCase().includes(lowerSearch),
      )
    }
    return categories
  }, [watch('categories')])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
          <TextHeading>Categories</TextHeading>

          <div className="flex items-center">
            <Button onClick={() => router('/users/newUser')}>
              <PlusCircle size={18} /> Adicionar categoria
            </Button>
          </div>
        </div>

        <FormProvider {...formCategories}>
          <form className="my-2">
            <Input name="categories" label="Pesquisar usuário" />
          </form>
        </FormProvider>

        <div className="mt-1 flex w-full flex-col gap-1 divide-y divide-gray-300 dark:divide-gray-300/20">
          {!categoriesFilter ||
            (categoriesFilter.length === 0 && (
              <TextBody
                size="sm"
                className="text-center font-semibold text-black dark:text-white"
              >
                Nenhua categoria encontrada!
              </TextBody>
            ))}
          {categoriesFilter.map((item, index) => (
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
                <Icon onClick={() => setIsOpenModal(true)}>
                  <PencilSimpleLine size={20} />
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