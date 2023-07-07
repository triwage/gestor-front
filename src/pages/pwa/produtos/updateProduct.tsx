import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { useMaxProducts } from '../../../services/max/products'
import { usePWACashback } from '../../../services/pwa/cashback'
import { usePWACategories } from '../../../services/pwa/categories'
import { addPWAProduct, updatePWAProduct } from '../../../services/pwa/products'
import { usePWAProviders } from '../../../services/pwa/providers'
import { useRVProducts } from '../../../services/rv/products'

import { PWAProductsProps } from '../../../@types/pwa/products'
import { SelectProps } from '../../../@types/select'

import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  Package,
} from '@phosphor-icons/react'

interface Inputs extends PWAProductsProps {
  cash: SelectProps | null
  productRv: SelectProps | null
  productMax: SelectProps | null
  category: SelectProps | null
  provider: SelectProps | null
}

export default function UpdateProductPWA() {
  const formProduct = useForm<Inputs>()
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
  const {
    data: ProductsMax,
    isLoading: isLoading5,
    isFetching: isFetching5,
  } = useMaxProducts()

  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProductMax(data: Inputs) {
    setLoading(true)
    data.prpw_cash_id = Number(data.cash?.value)
    data.prpw_prrv_id = Number(data.productRv?.value)
    data.prpw_max_id = Number(data.productMax?.value)
    data.prpw_pcpw_id = Number(data.category?.value)
    data.prpw_fopw_id = Number(data.provider?.value)

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

  const optionsProductsMax = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsMax) {
      res = ProductsMax?.map((item) => {
        return {
          value: Number(item.id),
          label: item.nome,
        }
      })
    }
    return res
  }, [ProductsMax])

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

      productEdit?.forEach((productItem) => {
        // @ts-expect-error
        if (checkTypeof[String(productItem)]) {
          setValue(
            // @ts-expect-error
            String(productItem),
            FormataValorMonetario(location.state[productItem], false),
          )
        } else {
          // @ts-expect-error
          setValue(String(productItem), location.state[productItem])
        }
      })
      setValue(
        'productRv',
        optionsProductsRV?.find(
          (e) => e.value === location.state.prpw_prrv_id,
        ) ?? null,
      )
      setValue(
        'productMax',
        optionsProductsMax?.find(
          (e) => e.value === location.state.prpw_max_id,
        ) ?? null,
      )
      setValue(
        'provider',
        optionsProviders?.find(
          (e) => e.value === location.state.prpw_fopw_id,
        ) ?? null,
      )
      setValue(
        'cash',
        optionsCashback?.find((e) => e.value === location.state.prpw_cash_id) ??
          null,
      )
      setValue(
        'category',
        optionsCategories?.find(
          (e) => e.value === location.state.prpw_pcpw_id,
        ) ?? null,
      )
    }
  }, [
    location,
    optionsCashback,
    optionsProviders,
    optionsCategories,
    optionsProductsRV,
    optionsProductsMax,
  ])

  return (
    <Container>
      {(isLoading ||
        isFetching ||
        isLoading2 ||
        isFetching2 ||
        isLoading3 ||
        isFetching3 ||
        isLoading4 ||
        isFetching4 ||
        isLoading5 ||
        isFetching5) && <Loader />}
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

            <div className="grid grid-cols-2 items-center gap-2">
              <Select
                control={control}
                label="Produto RV"
                name="productRv"
                options={optionsProductsRV}
              />
              <div className="flex items-center gap-2">
                <Select
                  control={control}
                  label="Produto MAX"
                  name="productMax"
                  options={optionsProductsMax}
                />
                <Button
                  title="Adicionar novo produto na Max nível"
                  className="mt-4 w-[10%]"
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                control={control}
                label="Fornecedor"
                name="provider"
                options={optionsProviders}
              />
              <Select
                control={control}
                label="Cashback"
                name="cash"
                options={optionsCashback}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Select
                control={control}
                label="Categoria"
                name="category"
                options={optionsCategories}
              />
              <Switch name="prpw_ativo" label="Produto ativo" />
            </div>
            <div className="w-full">
              <div className="flex items-end gap-4">
                {!watch('prpw_imagem') && (
                  <Icon>
                    <Package size={96} weight="fill" />
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
