import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { ImagesSquare, PencilSimple, PlusCircle } from '@phosphor-icons/react'
import clsx from 'clsx'

import Banner1 from '../../assets/banner1.png'
import Banner2 from '../../assets/banner2.png'
import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { PreviewBanner } from '../../components/Pages/Banners/PreviewBanner'
import { Dialog } from '../../components/System/Dialog'
import { Icon } from '../../components/System/Icon'
import { TextAction } from '../../components/Texts/TextAction'
import { TextBody } from '../../components/Texts/TextBody'
import { TextHeading } from '../../components/Texts/TextHeading'
import { Container } from '../../template/Container'

interface Inputs {
  banners: string
}

export default function Banners() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)

  const banners = [
    {
      img: Banner1,
      title: 'DASDASDASDADASDASDASDADASDA',
      subtitle: 'Testando o subtítulo',
      status: 'Ativo',
    },
    {
      img: Banner2,
      title: 'Indique e ganhe',
      subtitle: 'Testando o subtítulo',
      status: 'Ativo',
    },
    {
      img: Banner1,
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      subtitle: 'Testando o subtítulo',
      status: 'Inativo',
    },
    {
      img: Banner2,
      title: 'DASDASDASDADASDASDASDADASDA',
      subtitle: 'Testando o subtítulo',
      status: 'Inativo',
    },
    {
      img: Banner2,
      title: 'Lorem ipsum dolor sit amet,',
      subtitle: 'Testando o subtítulo',
      status: 'Inativo',
    },
  ]

  const router = useNavigate()
  const formUsers = useForm<Inputs>()
  const { watch } = formUsers

  const bannersFilter = useMemo(() => {
    if (watch('banners') && watch('banners') !== 'undefined') {
      const lowerSearch = watch('banners').toLowerCase()
      return banners?.filter((customer) =>
        customer.title.toLowerCase().includes(lowerSearch),
      )
    }
    return banners
  }, [watch('banners')])

  return (
    <Container>
      <div className="flex w-full items-center justify-between gap-2 border-b border-gray/30 pb-2">
        <TextHeading>Banners</TextHeading>

        <div className="flex items-center">
          <Button onClick={() => router('/banners/addBanner')}>
            <PlusCircle size={18} /> Add banner
          </Button>
        </div>
      </div>

      <FormProvider {...formUsers}>
        <form className="my-2">
          <Input name="banners" label="Pesquisar banners" />
        </form>
      </FormProvider>

      <div className="mt-1 flex w-full flex-col gap-1 divide-y divide-gray-300 dark:divide-gray-300/20">
        {!bannersFilter ||
          (bannersFilter.length === 0 && (
            <TextBody
              size="sm"
              className="text-center font-semibold text-black dark:text-white"
            >
              Nenhum usuário encontrado!
            </TextBody>
          ))}
        {bannersFilter.map((item, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-between rounded-md py-1"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-lg bg-gray-300 p-1 text-black">
                <img alt="teste" src={item.img} className="h-5 w-5" />
              </div>

              <TextAction
                size="sm"
                className="font-medium text-black dark:text-white"
              >
                {item.title}
              </TextAction>
              <TextAction size="xs" className="font-normal text-gray-500">
                {item.subtitle}
              </TextAction>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'flex items-center gap-1 rounded-md  px-2 py-1',
                  {
                    'bg-green': item.status === 'Ativo',
                    'bg-red': item.status === 'Inativo',
                  },
                )}
              >
                <TextAction size="xs" className="font-medium text-white">
                  {item.status}
                </TextAction>
              </div>
              <Icon
                click
                onClick={() => {
                  setBannerPreview(item)
                  setIsOpenModal(true)
                }}
              >
                <ImagesSquare size={20} />
              </Icon>
              <Icon>
                <PencilSimple size={20} />
              </Icon>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
        <div className="flex h-full w-full items-center justify-center">
          <PreviewBanner
            img={bannerPreview?.img}
            subtitle={bannerPreview?.subtitle}
            title={bannerPreview?.title}
          />
        </div>
      </Dialog>
    </Container>
  )
}
