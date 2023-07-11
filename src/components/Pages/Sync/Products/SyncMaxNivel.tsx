import { ChangeEvent, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadImages } from '../../../../services/images'

import { MaxProductsProps } from '../../../../@types/max/products'

import useLoading from '../../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../../functions/currency'
import { handleUploadImage } from '../../../../functions/general'
import { Button } from '../../../Form/Button'
import { Input } from '../../../Form/Input'
import { InputCurrency } from '../../../Form/InputCurrency'
import { Switch } from '../../../Form/Switch'
import { Textarea } from '../../../Form/Textarea'
import { Icon } from '../../../System/Icon'
import { TextAction } from '../../../Texts/TextAction'
import { Transition } from '@headlessui/react'
import { FloppyDiskBack, Images, Package, X } from '@phosphor-icons/react'

interface SyncMaxProps {
  open: boolean
  onClosed: () => void
  nome?: string
  preco?: string
  status?: boolean
}

export function SyncMax({ open, onClosed, nome, preco, status }: SyncMaxProps) {
  const formProduct = useForm<MaxProductsProps>()
  const { handleSubmit, setValue, watch } = formProduct

  const { setLoading } = useLoading()

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageCloud = await uploadImages(res)
      setValue('imagem_padrao_url', imageCloud)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function handleUpdateProductMax(data: MaxProductsProps) {
    setLoading(true)
    console.log(data)
    // await addPWAProduct(data)

    setLoading(false)
  }

  useEffect(() => {
    setValue('nome', nome ?? '')
    setValue('preco', FormataValorMonetario(preco, false) ?? null)
    setValue('status', status ?? false)
  }, [open, nome, preco, status])

  return (
    <Transition
      className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-opacity"
      show={open}
      enter="transition-all ease-in-out duration-200 delay-75"
      enterFrom="opacity-0 -translate-x-12"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all ease-in-out duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed right-0 top-0 z-50 flex h-full w-3/4 flex-col items-center bg-white dark:bg-black">
        <div
          onClick={onClosed}
          className="fixed -left-2 top-1 z-50 flex w-full justify-end"
        >
          <X
            size={24}
            className="cursor-pointer text-black dark:text-white"
            weight="bold"
          />
        </div>
        <div className="mt-10 flex w-[98%] flex-col items-center">
          <TextAction size="lg">Sincronizar produto com a Max nível</TextAction>
          <FormProvider {...formProduct}>
            <form
              className="mt-4 w-full space-y-2"
              onSubmit={handleSubmit(handleUpdateProductMax)}
            >
              <div className="flex gap-2">
                <Input name="nome" label="Nome" />
                <InputCurrency name="preco" label="Preço" />
              </div>

              <div className="flex gap-2">
                <Textarea name="descricao" label="Descrição" rows={8} />
              </div>
              <div className="grid grid-cols-2 items-start gap-2">
                <div className="flex items-end gap-4">
                  {!watch('imagem_padrao_url') && (
                    <Icon>
                      <Package size={96} weight="fill" />
                    </Icon>
                  )}

                  {watch('imagem_padrao_url') && (
                    <img
                      src={watch('imagem_padrao_url') ?? ''}
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
                        {!watch('imagem_padrao_url')
                          ? 'Adicionar imagem'
                          : 'Alterar imagem'}
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
                <Switch name="status" label="Produto ativo" />
              </div>
              <div className="absolute bottom-2 w-[98%] border-t border-border pt-1">
                <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                  <FloppyDiskBack size={18} weight="fill" />
                  Cadastrar produto na Max nível
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Transition>
  )
}
