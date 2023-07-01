import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { DateInput } from '../../../components/Form/Calendar'
import { Input } from '../../../components/Form/Input'
import { Switch } from '../../../components/Form/Switch'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { addNewBanner } from '../../../services/pwa/banners'

import { BannersProps } from '../../../@types/pwa/banners'

import { getBase64, handleUploadImage } from '../../../functions/general'
import { addYearsDate } from '../../../functions/timesAndDates'
import { Container } from '../../../template/Container'
import { yupResolver } from '@hookform/resolvers/yup'
import { CaretLeft, FileImage, FloppyDiskBack } from '@phosphor-icons/react'
import * as yup from 'yup'

const schemaBanners = yup
  .object({
    geba_botao_acao: yup.string().required('Campo obrigatório'),
    geba_dta_validade: yup.string(),
  })
  .required()

export default function AddBanner() {
  const [filesAnexed, setFilesAnexed] = useState<string | null>(null)
  const formBanner = useForm<BannersProps>({
    // @ts-expect-error
    resolver: yupResolver(schemaBanners),
  })
  const { handleSubmit, watch, control, setValue } = formBanner

  const router = useNavigate()
  const location = useLocation()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setFilesAnexed(imageFinal)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function handleAddNewUser(data: BannersProps) {
    if (!filesAnexed) {
      alerta('Faça o upload de uma imagem', 4)
      return
    }
    data.geba_dta_validade = data.geba_dta_validade || addYearsDate()
    await addNewBanner(data)
  }

  useEffect(() => {
    if (location.state) {
      const bannerEdit = Object.keys(location.state)

      bannerEdit?.forEach((bannerItem) => {
        if (bannerItem === 'geba_dta_validade') {
          // @ts-expect-error
          setValue('geba_dta_validade', new Date(location.state[bannerItem]))
        } else {
          // @ts-expect-error
          setValue(String(bannerItem), location.state[bannerItem])
        }
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
            <TextHeading>Adicionar novo banner</TextHeading>
          </div>
        </div>

        <FormProvider {...formBanner}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleAddNewUser)}
          >
            <div className="flex gap-2">
              <Input name="geba_botao_acao" label="Link" />
              <DateInput
                control={control}
                name="geba_dta_validade"
                label="Validade"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2 max-md:block">
              <div className="flex w-full flex-col gap-2 p-1">
                {filesAnexed && (
                  <div className="h-max w-max">
                    <img
                      src={filesAnexed}
                      alt="Banner"
                      width={335}
                      height={151}
                    />
                  </div>
                )}

                <label
                  htmlFor="newFile"
                  className="flex w-max cursor-pointer flex-col"
                >
                  <div className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                    <FileImage size={20} weight="fill" />
                    Anexar imagem
                  </div>
                  <TextAction className="text-sm text-black dark:text-white">
                    Anexe uma imagem com proporção 2.22, Ex: 800x360
                  </TextAction>
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
                name="geba_status"
                label={watch('geba_status') ? 'Ativo' : 'Inativo'}
              />
            </div>
            <Button onClick={() => handleSubmit(handleAddNewUser)}>
              <FloppyDiskBack size={18} weight="fill" />
              {location.state ? 'Atualizar Banner' : 'Salvar Banner'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
