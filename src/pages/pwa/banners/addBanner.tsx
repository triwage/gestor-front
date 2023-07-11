import { ChangeEvent, useEffect } from 'react'
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

import { uploadImages } from '../../../services/images'
import { addNewBanner, updateBanner } from '../../../services/pwa/banners'

import { BannersProps } from '../../../@types/pwa/banners'

import useLoading from '../../../contexts/LoadingContext'
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
  const formBanner = useForm<BannersProps>({
    // @ts-expect-error
    resolver: yupResolver(schemaBanners),
  })
  const { handleSubmit, watch, control, setValue } = formBanner

  const { setLoading } = useLoading()
  const router = useNavigate()
  const location = useLocation()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    setLoading(true)
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('geba_imagem', imageFinal)
      setValue('geba_imagem_altura', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
    setLoading(false)
  }

  async function handleAddNewBanner(data: BannersProps) {
    setLoading(true)
    let imageAnexed = watch('geba_imagem_altura')
    if (typeof imageAnexed !== 'object') {
      imageAnexed = watch('geba_imagem')
    }
    if (!imageAnexed) {
      alerta('Faça o upload de uma imagem', 4)
      setLoading(false)
      return
    }
    if (typeof imageAnexed === 'object') {
      data.geba_imagem = await uploadImages(imageAnexed)
      if (!data.geba_imagem) {
        setLoading(false)
        return
      }
    } else {
      data.geba_imagem = imageAnexed
    }
    data.geba_dta_validade = data.geba_dta_validade || addYearsDate()

    if (location.state) {
      await updateBanner(data)
    } else {
      await addNewBanner(data)
    }
    setLoading(false)
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
            onSubmit={handleSubmit(handleAddNewBanner)}
          >
            <div className="flex gap-2">
              <Input name="geba_botao_acao" label="Link" />
              <DateInput
                control={control}
                name="geba_dta_validade"
                label="Validade"
              />
            </div>
            <div className="max-md:block grid grid-cols-2 items-center gap-2">
              <div className="flex w-full flex-col gap-2 p-1">
                {watch('geba_imagem') && (
                  <div className="h-max w-max">
                    <img
                      src={watch('geba_imagem') ?? ''}
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
                  <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                    <FileImage size={20} weight="fill" />
                    {!watch('geba_imagem')
                      ? 'Adicionar imagem'
                      : 'Alterar imagem'}
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
            <Button onClick={() => handleSubmit(handleAddNewBanner)}>
              <FloppyDiskBack size={18} weight="fill" />
              {location.state ? 'Atualizar Banner' : 'Salvar Banner'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
