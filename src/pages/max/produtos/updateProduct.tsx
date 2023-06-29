import { ChangeEvent, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Textarea } from '../../../components/Form/Textarea'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { addMaxProduct, updateMaxProduct } from '../../../services/max/products'

import { MaxProductsProps } from '../../../@types/max/products'

import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  UserSquare,
} from '@phosphor-icons/react'

export default function UpdateMaxProduct() {
  const formProduct = useForm<MaxProductsProps>()
  const { handleSubmit, setValue, watch } = formProduct

  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProductMax(data: MaxProductsProps) {
    setLoading(true)
    if (location.state) {
      await updateMaxProduct(data)
    } else {
      await addMaxProduct(data)
    }
    setLoading(false)
  }

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

  useEffect(() => {
    const checkTypeof = {
      preco: true,
    }
    if (location.state) {
      const productEdit = Object.keys(location.state)

      productEdit?.forEach((user) => {
        // @ts-expect-error
        if (checkTypeof[String(user)]) {
          setValue(
            // @ts-expect-error
            String(user),
            FormataValorMonetario(location.state[user], false),
          )
        } else {
          // @ts-expect-error
          setValue(String(user), location.state[user])
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
            <TextHeading>
              {location.state
                ? 'Produtos Max Nível / Editar produto'
                : 'Produtos Max Nível / Adicionar produto'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formProduct}>
          <form
            className="my-2 space-y-2"
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
                    <UserSquare size={96} weight="fill" />
                  </Icon>
                )}

                {watch('imagem_padrao_url') && (
                  <img
                    src={watch('imagem_padrao_url')}
                    alt="Logo"
                    className="h-full max-h-48"
                  />
                )}
                <div>
                  <label
                    htmlFor="newFile"
                    className="flex w-max cursor-pointer flex-col"
                  >
                    <div className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
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
              <Checkbox name="status" label="Produto ativo" />
            </div>
            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar produto
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
