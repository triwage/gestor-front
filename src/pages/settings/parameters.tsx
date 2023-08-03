import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '../../components/Form/Button'
import { Input } from '../../components/Form/Input'
import { ModalInfoPWAProduct } from '../../components/Pages/PWA/ModalInfoPWAProduct'
import { alerta } from '../../components/System/Alert'
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
import {
  addPWACategories,
  usePWACategories,
} from '../../services/pwa/categories'
import { addPWAProduct, deletePWAProduct } from '../../services/pwa/products'

import { UpdateParamsDefaultProps } from '../../@types/paramsDefault'
import { SelectProps } from '../../@types/select'

import useLoading from '../../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../../functions/general'
import { Container } from '../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  FileImage,
  Eye,
  PlusSquare,
  X,
} from '@phosphor-icons/react'

interface Inputs extends UpdateParamsDefaultProps {
  para_prod_pgto_pwa_id: number | null
  para_imagem: string | null
  imagem_aux_produto: File | null
  para_imagem_padrao_fornecedor: string | null
  imagem_aux_fornecedor: File | null
  para_imagem_padrao_categoria: string | null
  imagem_aux_categoria: File | null
  productMax: SelectProps | null
}

export default function Params() {
  const [isOpenModalPWAProduct, setIsOpenModalPWAProduct] = useState(false)
  const [idData, setIdData] = useState<number | null>(null)

  const formParams = useForm<Inputs>()
  const { handleSubmit, setValue, watch } = formParams

  const { data: ParamsDefault, isLoading, isFetching } = useParamsDefault()
  const {
    data: PWACategories,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWACategories()
  const router = useNavigate()
  const { setLoading } = useLoading()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('para_imagem', imageFinal)
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
      data.para_imagem = await uploadImages(imageAnexed)
    } else {
      data.para_imagem = watch('para_imagem')
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
      data.para_imagem_padrao_categoria = await uploadImages(
        imageAnexedCategory,
      )
    } else {
      data.para_imagem_padrao_categoria = watch('para_imagem_padrao_categoria')
    }

    if (!data.para_prod_pgto_pwa_id) {
      const res = await addMaxProduct({
        descricao: 'Produto de pagamento padrão',
        imagem_padrao_url: data.para_imagem,
        preco: 0.01,
        status: true,
        nome: 'Produto de pagamento padrão',
        id: null,
      })

      if (res) {
        const defaultCategory = PWACategories?.find((e) => e.categoria_padrao)
        let prpw_pcpw_id = null
        if (defaultCategory) {
          prpw_pcpw_id = defaultCategory?.pcpw_id
        } else {
          const newCategorie = await addPWACategories({
            pcpw_cash_id: null,
            pcpw_descricao: 'Categoria padrão pagamento',
            pcpw_imagem: 'Sem imagem',
            pcpw_ativo: true,
            pcpw_categoria_operacao: 'pagamentos',
          })
          prpw_pcpw_id = newCategorie?.pcpw_id
        }

        const resPwa = await addPWAProduct({
          prpw_id: null,
          prrv_nome: null,
          prpw_prrv_id: null,
          prpw_max_id: Number(res?.id),
          prpw_cash_id: null,
          cash_descricao: null,
          prpw_pcpw_id,
          pcpw_descricao: null,
          prpw_fopw_id: null,
          fopw_descricao: null,
          prpw_descricao: 'Produto de pagamento padrão',
          prpw_imagem: 'não nula',
          prpw_valor: 0.01,
          prpw_ativo: true,
        })

        data.para_prod_pgto_pwa_id = Number(resPwa?.id)
      }
    }
    await updateParamsDefault(data)
    setLoading(false)
  }

  async function addProduct() {
    setLoading(true)

    const res = await addMaxProduct({
      descricao: 'Produto de pagamento padrão',
      imagem_padrao_url: null,
      preco: 0.01,
      status: true,
      nome: 'Produto de pagamento padrão',
      id: null,
    })

    if (res) {
      const defaultCategory = PWACategories?.find((e) => e.categoria_padrao)
      let prpw_pcpw_id = null
      if (defaultCategory) {
        prpw_pcpw_id = defaultCategory?.pcpw_id
      } else {
        const newCategorie = await addPWACategories({
          pcpw_cash_id: null,
          pcpw_descricao: 'Categoria padrão de pagamento',
          pcpw_imagem: 'Sem imagem',
          pcpw_ativo: true,
          pcpw_categoria_operacao: 'pagamentos',
        })
        prpw_pcpw_id = newCategorie?.pcpw_id
      }

      const resPwa = await addPWAProduct({
        prpw_id: null,
        prrv_nome: null,
        prpw_prrv_id: null,
        prpw_max_id: Number(res?.id),
        prpw_cash_id: null,
        cash_descricao: null,
        prpw_pcpw_id,
        pcpw_descricao: null,
        prpw_fopw_id: null,
        fopw_descricao: null,
        prpw_descricao: 'Produto de pagamento padrão',
        prpw_imagem: 'não nula',
        prpw_valor: 0.01,
        prpw_ativo: true,
      })
      setValue('para_prod_pgto_pwa_id', Number(resPwa?.prpw_id))
      await updateParamsDefault({
        para_id: 1,
        para_prod_pgto_pwa_id: Number(resPwa?.prpw_id),
        para_imagem: null,
        para_imagem_padrao_fornecedor: null,
        para_imagem_padrao_categoria: null,
      })
    }
    setLoading(false)
  }

  async function removeProduct() {
    setLoading(true)
    const id = watch('para_prod_pgto_pwa_id')

    if (id) {
      const res = await deletePWAProduct(id)

      if (res) {
        setValue('para_prod_pgto_pwa_id', null)
        alerta('Produto removido com sucesso', 1)
      }
    }
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
      {(isLoading || isFetching || isLoading2 || isFetching2) && <Loader />}
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
            <div className="flex h-full w-full items-start gap-2">
              <div className="flex min-h-[240px] w-1/2 flex-col justify-between gap-1">
                <Input
                  name="para_prod_pgto_pwa_id"
                  label="Produto de pagamento padrão"
                  disabled
                />
                <div className="flex w-full flex-col gap-2">
                  <Button
                    type="button"
                    variant="structure"
                    className="bg-purple text-white"
                    onClick={() => {
                      setIdData(watch('para_prod_pgto_pwa_id'))
                      setIsOpenModalPWAProduct(true)
                    }}
                  >
                    <Eye size={20} />
                    Ver produto
                  </Button>
                  {!watch('para_prod_pgto_pwa_id') ? (
                    <Button type="button" onClick={addProduct}>
                      <PlusSquare size={20} />
                      Adicionar produto
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="structure"
                      className="bg-red text-white"
                      onClick={removeProduct}
                    >
                      <X size={20} />
                      Excluir produto
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex min-h-[240px] w-1/2 flex-col justify-between gap-2 p-1">
                <TextAction className="text-sm font-medium text-black dark:text-white">
                  Imagem padrão para produto
                </TextAction>
                {watch('para_imagem') && (
                  <div className="max-h-[197px] w-[123px] rounded-md">
                    <img src={watch('para_imagem') ?? ''} alt="Produto" />
                  </div>
                )}

                <label
                  htmlFor="newFile"
                  className="flex w-max cursor-pointer flex-col"
                >
                  <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                    <FileImage size={20} weight="fill" />
                    {!watch('para_imagem')
                      ? 'Adicionar imagem'
                      : 'Alterar imagem'}
                  </div>
                  {watch('para_imagem') && (
                    <Button
                      onClick={() => {
                        setValue('para_imagem', null)
                        setValue('imagem_aux_produto', null)
                      }}
                      type="button"
                      variant="structure"
                      className="mt-1 bg-red text-white"
                    >
                      <X size={20} />
                      Remover imagem
                    </Button>
                  )}
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
              <div className="flex h-full min-h-[280px] w-full flex-col justify-between gap-2 p-1">
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
                      {watch('para_imagem_padrao_fornecedor') && (
                        <Button
                          onClick={() => {
                            setValue('para_imagem_padrao_fornecedor', null)
                            setValue('imagem_aux_fornecedor', null)
                          }}
                          type="button"
                          variant="structure"
                          className="mt-1 bg-red text-white"
                        >
                          <X size={20} />
                          Remover imagem
                        </Button>
                      )}
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
              <div className="flex h-full min-h-[280px] w-full flex-col justify-between gap-2 p-1">
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
                      {watch('para_imagem_padrao_categoria') && (
                        <Button
                          onClick={() => {
                            setValue('para_imagem_padrao_categoria', null)
                            setValue('imagem_aux_categoria', null)
                          }}
                          type="button"
                          variant="structure"
                          className="mt-1 bg-red text-white"
                        >
                          <X size={20} />
                          Remover imagem
                        </Button>
                      )}

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
              <Button type="submit" onClick={() => handleSubmit(onSubmit)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar parâmetro
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {idData && isOpenModalPWAProduct && (
        <ModalInfoPWAProduct
          open={isOpenModalPWAProduct}
          closeDialog={() => setIsOpenModalPWAProduct(false)}
          id={idData}
        />
      )}
    </Container>
  )
}
