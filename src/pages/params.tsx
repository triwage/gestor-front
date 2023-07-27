import { ChangeEvent, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '../components/Form/Button'
import { Input } from '../components/Form/Input'
import { Icon } from '../components/System/Icon'
import { Loader } from '../components/System/Loader'
import { TextHeading } from '../components/Texts/TextHeading'

import { uploadImages } from '../services/images'
import { addMaxProduct } from '../services/max/products'
import {
  updateParamsDefault,
  useParamsDefault,
} from '../services/paramsDefault'

import { UpdateParamsDefaultProps } from '../@types/paramsDefault'
import { SelectProps } from '../@types/select'

import useLoading from '../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../functions/general'
import { Container } from '../template/Container'
import {
  CaretLeft,
  Storefront,
  Images,
  FloppyDiskBack,
  Package,
  ListPlus,
} from '@phosphor-icons/react'

interface Inputs extends UpdateParamsDefaultProps {
  para_prod_pgto_max_id: number | null
  para_imagem_padrao_produto: string | null
  imagem_aux_produto: File
  para_imagem_padrao_fornecedor: string | null
  imagem_aux_fornecedor: File
  para_imagem_padrao_categoria: string | null
  imagem_aux_categoria: File
  productMax: SelectProps | null
}

export default function Params() {
  const formParams = useForm<Inputs>()
  const { handleSubmit, setValue, watch } = formParams

  const { data: ParamsDefault, isLoading, isFetching } = useParamsDefault()
  const router = useNavigate()
  const { setLoading } = useLoading()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('para_imagem_padrao_produto', imageFinal)
      setValue('imagem_aux_produto', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function getImageProvider(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('para_imagem_padrao_fornecedor', imageFinal)
      setValue('imagem_aux_fornecedor', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }
  async function getImageCategory(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('para_imagem_padrao_categoria', imageFinal)
      setValue('imagem_aux_categoria', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function onSubmit(data: Inputs) {
    setLoading(true)
    const imageAnexed = watch('imagem_aux_produto')
    const imageAnexedProvider = watch('imagem_aux_fornecedor')
    const imageAnexedCategory = watch('imagem_aux_categoria')

    if (imageAnexed) {
      data.para_imagem_padrao_produto = await uploadImages(imageAnexed)
    } else {
      data.para_imagem_padrao_produto = watch('para_imagem_padrao_produto')
    }
    if (imageAnexedProvider) {
      data.para_imagem_padrao_fornecedor = await uploadImages(
        imageAnexedProvider,
      )
    } else {
      data.para_imagem_padrao_fornecedor = watch(
        'para_imagem_padrao_fornecedor',
      )
    }

    if (imageAnexedCategory) {
      data.para_imagem_padrao_categoria = await uploadImages(imageAnexed)
    } else {
      data.para_imagem_padrao_categoria = watch('para_imagem_padrao_categoria')
    }

    if (!data.para_prod_pgto_max_id) {
      const res = await addMaxProduct({
        descricao: 'Produto padrão',
        imagem_padrao_url: data.para_imagem_padrao_produto,
        preco: 0.01,
        status: true,
        nome: 'Produto padrão',
        id: null,
      })

      data.para_prod_pgto_max_id = Number(res?.id)
    }
    await updateParamsDefault(data)
    setLoading(false)
  }

  useEffect(() => {
    if (ParamsDefault) {
      const paramsDefault = Object.keys(ParamsDefault)

      paramsDefault?.forEach((param) => {
        // @ts-expect-error
        setValue(String(param), ParamsDefault[param])
      })
    }
  }, [ParamsDefault])

  return (
    <Container>
      {(isLoading || isFetching) && <Loader />}
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Parâmetros padrão</TextHeading>
          </div>
        </div>

        <FormProvider {...formParams}>
          <form className="my-2 space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-2">
              <Input name="para_id" label="ID parâmetro" disabled />
              <div className="flex items-end gap-4">
                {!watch('para_imagem_padrao_produto') && (
                  <Icon>
                    <Package size={96} />
                  </Icon>
                )}

                {watch('para_imagem_padrao_produto') && (
                  <img
                    src={watch('para_imagem_padrao_produto') ?? ''}
                    alt="Logo"
                    className="h-full max-h-48"
                  />
                )}
                <div>
                  <label
                    htmlFor="newFile"
                    className="flex w-max cursor-pointer flex-col"
                  >
                    <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                      <Images size={20} weight="fill" />
                      {!watch('para_imagem_padrao_produto')
                        ? 'Adicionar imagem produto'
                        : 'Alterar imagem produto'}
                    </div>
                  </label>
                  <input
                    className="hidden"
                    id="newFile"
                    type="file"
                    accept="image/*"
                    onChange={getImage}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-end gap-4">
                {!watch('para_imagem_padrao_fornecedor') && (
                  <Icon>
                    <Storefront size={96} />
                  </Icon>
                )}

                {watch('para_imagem_padrao_fornecedor') && (
                  <img
                    src={watch('para_imagem_padrao_fornecedor') ?? ''}
                    alt="Fornecedor"
                    className="h-full max-h-48"
                  />
                )}
                <div>
                  <label
                    htmlFor="newFileProviderParams"
                    className="flex w-max cursor-pointer flex-col"
                  >
                    <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                      <Images size={20} weight="fill" />
                      {!watch('para_imagem_padrao_fornecedor')
                        ? 'Adicionar imagem fornecedor'
                        : 'Alterar imagem fornecedor'}
                    </div>
                  </label>
                  <input
                    className="hidden"
                    id="newFileProviderParams"
                    type="file"
                    accept="image/*"
                    onChange={getImageProvider}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-end gap-4">
                {!watch('para_imagem_padrao_categoria') && (
                  <Icon>
                    <ListPlus size={96} />
                  </Icon>
                )}

                {watch('para_imagem_padrao_categoria') && (
                  <img
                    src={watch('para_imagem_padrao_categoria') ?? ''}
                    alt="Fornecedor"
                    className="h-full max-h-48"
                  />
                )}
                <div>
                  <label
                    htmlFor="newFileCategoryParams"
                    className="flex w-max cursor-pointer flex-col"
                  >
                    <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                      <Images size={20} weight="fill" />
                      {!watch('para_imagem_padrao_categoria')
                        ? 'Adicionar imagem categoria'
                        : 'Alterar imagem categoria'}
                    </div>
                  </label>
                  <input
                    className="hidden"
                    id="newFileCategoryParams"
                    type="file"
                    accept="image/*"
                    onChange={getImageCategory}
                  />
                </div>
              </div>
            </div>

            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(onSubmit)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar parâmetro
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
