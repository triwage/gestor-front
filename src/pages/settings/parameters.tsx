import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { ModalInfoMaxProduct } from '../../components/Pages/PWA/ModalInfoMaxProduct'
import { Icon } from '../../components/System/Icon'
import { Loader } from '../../components/System/Loader'
import { TextAction } from '../../components/Texts/TextAction'
import { TextHeading } from '../../components/Texts/TextHeading'

import { uploadImages } from '../../services/images'
import { addMaxProduct } from '../../services/max/products'
import {
  updateParamsDefault,
  useParamsDefault,
} from '../../services/paramsDefault'

import { UpdateParamsDefaultProps } from '../../@types/paramsDefault'
import { SelectProps } from '../../@types/select'

import useConfirm from '../../contexts/ConfirmContext'
import useLoading from '../../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../../functions/general'
import { Container } from '../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  FileImage,
  ArrowSquareOut,
  ArrowCounterClockwise,
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
  const [isOpenModalMaxProduct, setIsOpenModalMaxProduct] = useState(false)
  const [idData, setIdData] = useState<number | null>(null)

  const formParams = useForm<Inputs>()
  const { handleSubmit, setValue, watch } = formParams

  const {
    data: ParamsDefault,
    isLoading,
    isFetching,
    refetch,
  } = useParamsDefault()
  const router = useNavigate()
  const { setLoading } = useLoading()
  const { Confirm } = useConfirm()

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

  async function resetParams() {
    const check = await Confirm({
      title: 'Restar parâmetros',
      message: 'Tem certeza que deseja limpar os parâmetros?',
    })

    if (check) {
      setLoading(true)
      const payload = {
        para_id: 1,
        para_prod_pgto_max_id: null,
        para_imagem_padrao_produto: null,
        para_imagem_padrao_fornecedor: null,
        para_imagem_padrao_categoria: null,
      }
      // @ts-expect-error
      await updateParamsDefault(payload)
      refetch()
      setLoading(false)
    }
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
          <form
            className="my-2 h-full w-full space-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex w-full items-start gap-2">
              <div className="flex w-1/2 items-center gap-2">
                <Input
                  name="para_prod_pgto_max_id"
                  label="ID Produto MAX"
                  disabled
                />
                <Icon
                  className="h-5 w-5"
                  title="Ver produto max"
                  onClick={() => {
                    setIdData(watch('para_prod_pgto_max_id'))
                    setIsOpenModalMaxProduct(true)
                  }}
                >
                  <ArrowSquareOut
                    size={22}
                    weight="fill"
                    className="text-black dark:text-white"
                  />
                </Icon>
              </div>
              <div className="flex w-1/2 flex-col gap-2 p-1">
                <TextAction className="text-sm font-medium text-black dark:text-white">
                  Imagem padrão para produto
                </TextAction>
                {watch('para_imagem_padrao_produto') && (
                  <div className="max-h-[197px] w-[123px] rounded-md">
                    <img
                      src={watch('para_imagem_padrao_produto') ?? ''}
                      alt="Produto"
                    />
                  </div>
                )}

                <label
                  htmlFor="newFile"
                  className="flex w-max cursor-pointer flex-col"
                >
                  <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                    <FileImage size={20} weight="fill" />
                    {!watch('para_imagem_padrao_produto')
                      ? 'Adicionar imagem'
                      : 'Alterar imagem'}
                  </div>
                  <TextAction className="text-sm text-black dark:text-white">
                    Anexe uma imagem com proporção 1.6, Ex: 197x123
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
            </div>

            <div className="flex h-full w-full gap-2 border-t border-border pt-1">
              <div className="flex h-full min-h-[240px] w-full flex-col justify-between gap-2 p-1">
                <TextAction className="text-sm font-medium text-black dark:text-white">
                  Imagem padrão para fornecedor
                </TextAction>
                <div className="flex flex-col gap-2">
                  {watch('para_imagem_padrao_fornecedor') && (
                    <div className="max-h-[120px] w-[165.5px] rounded-md">
                      <img
                        src={watch('para_imagem_padrao_fornecedor') ?? ''}
                        alt="Fornecedor"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-end gap-1">
                    <label
                      htmlFor="newFileProviderParams"
                      className="flex w-max cursor-pointer flex-col"
                    >
                      <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                        <FileImage size={20} weight="fill" />
                        {!watch('para_imagem_padrao_fornecedor')
                          ? 'Adicionar imagem fornecedor'
                          : 'Alterar imagem fornecedor'}
                      </div>
                      <TextAction className="text-sm text-black dark:text-white">
                        Anexe uma imagem com proporção 1.3, Ex: 165x120
                      </TextAction>
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
              <div className="flex h-full min-h-[240px] w-full flex-col justify-between gap-2 p-1">
                <TextAction className="text-sm font-medium text-black dark:text-white">
                  Imagem padrão para categoria
                </TextAction>
                <div className="flex flex-col gap-2">
                  {watch('para_imagem_padrao_categoria') && (
                    <div className="max-h-[195px] w-[146px] rounded-md">
                      <img
                        src={watch('para_imagem_padrao_categoria') ?? ''}
                        alt="Fornecedor"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-end gap-1">
                    <label
                      htmlFor="newFileCategoryParams"
                      className="flex w-max cursor-pointer flex-col"
                    >
                      <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                        <FileImage size={20} weight="fill" />
                        {!watch('para_imagem_padrao_categoria')
                          ? 'Adicionar imagem categoria'
                          : 'Alterar imagem categoria'}
                      </div>
                      <TextAction className="text-sm text-black dark:text-white">
                        Anexe uma imagem com proporção 0.75, Ex: 146x195
                      </TextAction>
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
            </div>

            <div className="w-full border-t border-border pt-3">
              <Button
                variant="structure"
                type="button"
                className="bg-red text-white"
                onClick={async () => await resetParams()}
              >
                <ArrowCounterClockwise size={18} weight="fill" />
                Resetar parâmetros
              </Button>
            </div>
            <div className="w-full">
              <Button type="submit" onClick={() => handleSubmit(onSubmit)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar parâmetro
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {idData && isOpenModalMaxProduct && (
        <ModalInfoMaxProduct
          open={isOpenModalMaxProduct}
          closeDialog={() => setIsOpenModalMaxProduct(false)}
          id={idData}
        />
      )}
    </Container>
  )
}
