import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Select } from '../../../components/Form/Select'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { usePWACashback } from '../../../services/pwa/cashback'
import { usePWACategories } from '../../../services/pwa/categories'
import { addPWAProduct, updatePWAProduct } from '../../../services/pwa/products'
import { usePWAProviders } from '../../../services/pwa/providers'
import { useRVProducts } from '../../../services/rv/products'

import { PWAProductsProps } from '../../../@types/pwa/products'

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

export default function UpdateProductPWA() {
  const formProduct = useForm<PWAProductsProps>()
  const { handleSubmit, setValue, watch, control } = formProduct

  const { data: ProductsRV, isLoading, isFetching } = useRVProducts()
  const {
    data: CashbackPWA,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWACashback()
  const {
    data: CategoriesPWA,
    isLoading: isLoading3,
    isFetching: isFetching3,
  } = usePWACategories()
  const {
    data: ProvidersPWA,
    isLoading: isLoading4,
    isFetching: isFetching4,
  } = usePWAProviders()

  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProductMax(data: PWAProductsProps) {
    setLoading(true)
    if (location.state) {
      await updatePWAProduct(data)
    } else {
      await addPWAProduct(data)
    }
    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageCloud = await uploadImages(res)
      setValue('prpw_imagem', imageCloud)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  const optionsProductsRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsRV) {
      res = ProductsRV?.map((item) => {
        return {
          value: item.prrv_id,
          label: item.prrv_nome,
        }
      })
    }
    return res
  }, [ProductsRV])

  const optionsCashback = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CashbackPWA) {
      res = CashbackPWA?.map((item) => {
        return {
          value: item.cash_id,
          label: item.cash_descricao,
        }
      })
    }
    return res
  }, [CashbackPWA])

  const optionsProviders = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>

    if (ProvidersPWA) {
      res = ProvidersPWA?.map((item) => {
        return {
          value: item.fopw_id,
          label: item.fopw_nome,
        }
      })
    }
    return res
  }, [ProvidersPWA])

  const optionsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CategoriesPWA) {
      res = CategoriesPWA?.map((item) => {
        return {
          value: item.pcpw_id,
          label: item.pcpw_descricao,
        }
      })
    }
    return res
  }, [CategoriesPWA])

  useEffect(() => {
    const checkTypeof = {
      prpw_valor: true,
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
      {(isLoading ||
        isFetching ||
        isLoading2 ||
        isFetching2 ||
        isLoading3 ||
        isFetching3 ||
        isLoading4 ||
        isFetching4) && <Loader />}
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>
              {location.state
                ? 'Produtos PWA / Editar produto'
                : 'Produtos PWA / Adicionar produto'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formProduct}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateProductMax)}
          >
            <div className="flex gap-2">
              <Input name="prpw_descricao" label="Nome" />
              <InputCurrency name="prpw_valor" label="Preço" />
            </div>

            <div className="flex gap-2">
              <Select
                control={control}
                label="Produto RV"
                name="prpw_prrv_id"
                options={optionsProductsRV}
              />
              <Select
                control={control}
                label="Fornecedor"
                name="prpw_fopw_id"
                options={optionsProviders}
              />
            </div>
            <div className="flex gap-2">
              <Select
                control={control}
                label="Cashback"
                name="prpw_cash_id"
                options={optionsCashback}
              />
              <Select
                control={control}
                label="Categoria"
                name="prpw_pcpw_id"
                options={optionsCategories}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="flex items-end gap-4">
                {!watch('prpw_imagem') && (
                  <Icon>
                    <UserSquare size={96} weight="fill" />
                  </Icon>
                )}

                {watch('prpw_imagem') && (
                  <img
                    src={watch('prpw_imagem')}
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
                      {!watch('prpw_imagem')
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
              <Checkbox name="prpw_ativo" label="Produto ativo" />
            </div>
            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                <FloppyDiskBack size={18} weight="fill" />
                {location.state ? 'Atualizar produto' : 'Adicionar produto'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
