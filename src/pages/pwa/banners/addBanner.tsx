import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  CaretLeft,
  Eye,
  FileImage,
  FloppyDiskBack,
} from '@phosphor-icons/react'
import * as yup from 'yup'

import { BannersProps } from '../../@types/banners'
import { Button } from '../../components/Form/Button'
import { DateInput } from '../../components/Form/Calendar'
import { Input } from '../../components/Form/Input'
import { Switch } from '../../components/Form/Switch'
import { PreviewBanner } from '../../components/Pages/Banners/PreviewBanner'
import { alerta } from '../../components/System/Alert'
import { Dialog } from '../../components/System/Dialog'
import { Icon } from '../../components/System/Icon'
import { TextHeading } from '../../components/Texts/TextHeading'
import { handleUploadImage } from '../../functions/general'
import { addYearsDate } from '../../functions/timesAndDates'
import { addNewBanner } from '../../services/banners'
import { Container } from '../../template/Container'

const schemaBanners = yup
  .object({
    gebaTitulo: yup.string().required('Informe o título'),
    gebaSubtitulo: yup.string().required('Crie um sub título'),
    gebaBotaoTexto: yup.string().required('Campo obrigatório'),
    gebaBotaoAcao: yup.string().required('Campo obrigatório'),
    gebaDtaValidade: yup.string(),
    gebaStatus: yup.boolean(),
  })
  .required()

export default function AddBanner() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [filesAnexed, setFilesAnexed] = useState<string | null>(null)
  const formBanner = useForm<BannersProps>({
    // @ts-expect-error
    resolver: yupResolver(schemaBanners),
  })
  const { handleSubmit, watch, control } = formBanner

  const router = useNavigate()
  const location = useLocation()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    setFilesAnexed(res || null)
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function handleAddNewUser({
    gebaTitulo,
    gebaSubtitulo,
    gebaBotaoTexto,
    gebaBotaoAcao,
    gebaStatus,
    gebaDtaValidade,
  }: BannersProps) {
    if (!filesAnexed) {
      alerta('Faça o upload de uma imagem', 4)
      return
    }
    await addNewBanner({
      gebaTitulo,
      gebaSubtitulo,
      gebaBotaoTexto,
      gebaBotaoAcao,
      gebaStatus,
      gebaImagem: filesAnexed,
      gebaDtaValidade: gebaDtaValidade || addYearsDate(),
    })
  }

  useEffect(() => {
    console.log(location.state)
  }, [location])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Adicionar novo banner</TextHeading>
          </div>
        </div>

        <FormProvider {...formBanner}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleAddNewUser)}
          >
            <div className="flex gap-2">
              <Input name="gebaTitulo" label="Título" />
              <Input name="gebaSubtitulo" label="Sub título" />
            </div>

            <div className="flex gap-2">
              <Input name="gebaBotaoTexto" label="Mensagem botão" />
              <Input name="gebaBotaoAcao" label="Link" />
            </div>
            <DateInput
              control={control}
              name="gebaDtaValidade"
              label="Tempo de duração"
            />
            <div className="grid grid-cols-2 gap-1">
              <div className="flex w-full p-1">
                <label
                  htmlFor="newFile"
                  className="flex h-[155px] w-full max-w-[370px] items-center justify-center rounded-md border border-dashed border-primary dark:border-white"
                >
                  {!filesAnexed && (
                    <div className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                      <FileImage size={20} weight="fill" />
                      Anexar imagem
                    </div>
                  )}
                  {filesAnexed && (
                    <img
                      src={filesAnexed}
                      alt="Banner"
                      className="h-[155px] w-[370px] rounded-md"
                    />
                  )}
                </label>

                <input
                  className="hidden"
                  id="newFile"
                  type="file"
                  accept="image/*"
                  onChange={getImage}
                />
              </div>
              <Switch
                name="gebaStatus"
                label={watch('gebaStatus') ? 'Ativo' : 'Inativo'}
              />
            </div>
            <Button onClick={() => handleSubmit(handleAddNewUser)}>
              <FloppyDiskBack size={18} weight="fill" /> Salvar Banner
            </Button>
          </form>
        </FormProvider>
        <div className="flex w-full items-center gap-1 border-t border-border pt-1">
          <Button
            onClick={() => {
              if (!filesAnexed) {
                alerta('Adicione uma imagem para abrir o Preview')
              }
              setIsOpenModal(true)
            }}
            variant="structure"
            className="bg-purple text-white"
          >
            <Eye size={18} weight="fill" /> Preview
          </Button>
        </div>
      </div>
      {filesAnexed && (
        <Dialog open={isOpenModal} closeDialog={() => setIsOpenModal(false)}>
          <div className="flex h-full w-full items-center justify-center">
            <PreviewBanner
              gebaImagem={filesAnexed}
              gebaTitulo={watch('gebaTitulo')}
              gebaSubtitulo={watch('gebaSubtitulo')}
              gebaBotaoTexto={watch('gebaBotaoTexto')}
              gebaBotaoAcao={''}
              gebaStatus={false}
              gebaDtaValidade={''}
            />
          </div>
        </Dialog>
      )}
    </Container>
  )
}
