import { ChangeEvent, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  CaretLeft,
  Eye,
  FileImage,
  FloppyDiskBack,
} from '@phosphor-icons/react'
import imageCompression from 'browser-image-compression'
import * as yup from 'yup'

import { Button } from '../../components/Form/Button'
import { DateInput } from '../../components/Form/Calendar'
import { Input } from '../../components/Form/Input'
import { Switch } from '../../components/Form/Switch'
import { alerta } from '../../components/System/Alert'
import { Icon } from '../../components/System/Icon'
import { TextHeading } from '../../components/Texts/TextHeading'
import { Container } from '../../template/Container'

export interface InputsAddBanner {
  gebaTitulo: string
  gebaSubtitulo: string
  gebaBotaoTexto: string
  gebaBotaoAcao: string
  gebaImagem: string
  gebaImagemAltura: number
  gebaImagemLargura: number
  gebaStatus: boolean
  gebaDtaValidade: string
  id?: number
}

const schemaUsers = yup
  .object({
    gebaTitulo: yup.string().required('Informe o título'),
    gebaSubtitulo: yup.string().required('Crie um sub título'),
    gebaBotaoTexto: yup.string().required('Campo obrigatório'),
    gebaBotaoAcao: yup.string().required('Campo obrigatório'),
    gebaImagem: yup.string().required('Campo obrigatório'),
    gebaDtaValidade: yup.string().required('Campo obrigatório'),
  })
  .required()

export default function AddBanner() {
  const [filesAnexed, setFilesAnexed] = useState(null)
  const formBanner = useForm<InputsAddBanner>({
    resolver: yupResolver(schemaUsers),
  })
  const { handleSubmit, watch, control } = formBanner
  const router = useNavigate()

  async function handleUploadImage(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }
    const imagem = files[0]

    try {
      if (imagem) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(imagem, options)

        const shortImage =
          compressedFile.size > imagem.size ? imagem : compressedFile

        const resData = (await getBase64(shortImage)) as string

        setFilesAnexed(resData)

        const inputElem = document.getElementById('newFile') as HTMLInputElement
        if (inputElem) {
          inputElem.value = ''
        }
      }
    } catch (error: any) {
      alerta(error)
    }
  }

  async function getBase64(blob: any) {
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    })
  }

  async function handleAddNewUser({
    nomeCompleto,
    nomeDeUsuario,
    email,
    senha,
  }: InputsAddNewUser) {
    // await addNewUser({ nomeCompleto, nomeDeUsuario, email, senha })
  }

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
              <Input name="nomeCompleto" label="Título" />
              <Input name="nomeDeUsuario" label="Sub título" />
            </div>

            <div className="flex gap-2">
              <Input name="email" label="Mensagem botão" />
              <Input name="senha" label="Link" />
            </div>
            <DateInput
              control={control}
              name="validate"
              label="Tempo de duração"
            />
            <div className="grid grid-cols-2 gap-1">
              <div className="flex w-full p-1">
                <label
                  htmlFor="newFile"
                  className="flex h-[155px] w-full max-w-[370px] items-center justify-center rounded-md border border-dashed border-primary"
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
                  onChange={async (event) => {
                    await handleUploadImage(event)
                  }}
                />
              </div>
              <Switch
                name="status"
                label={watch('status') ? 'Ativo' : 'Inativo'}
              />
            </div>

            <div className="flex w-full items-center gap-1 border-t border-border pt-1">
              <Button variant="structure" className="bg-purple text-white">
                <Eye size={18} weight="fill" /> Preview
              </Button>
              <Button onClick={() => handleSubmit(handleAddNewUser)}>
                <FloppyDiskBack size={18} weight="fill" /> Salvar Banner
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
