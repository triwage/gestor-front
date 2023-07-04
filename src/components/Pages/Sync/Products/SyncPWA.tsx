import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { usePWACashback } from '../../../../services/pwa/cashback'
import { usePWACategories } from '../../../../services/pwa/categories'
import { usePWAProviders } from '../../../../services/pwa/providers'
import { useRVProducts } from '../../../../services/rv/products'

import { PWAProductsProps } from '../../../../@types/pwa/products'
import { SelectProps } from '../../../../@types/select'

import useLoading from '../../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../../functions/currency'
import { Button } from '../../../Form/Button'
import { Input } from '../../../Form/Input'
import { InputCurrency } from '../../../Form/InputCurrency'
import { Select } from '../../../Form/Select'
import { Switch } from '../../../Form/Switch'
import { Icon } from '../../../System/Icon'
import { Loader } from '../../../System/Loader'
import { TextAction } from '../../../Texts/TextAction'
import { Transition } from '@headlessui/react'
import { FloppyDiskBack, Images, UserSquare, X } from '@phosphor-icons/react'

interface SheetProps {
  open: boolean
  onClosed: () => void
  prpw_descricao?: string
  prpw_valor?: string
  prpw_imagem?: string
  prpw_ativo?: boolean
  cash?: string | number
  productRv?: string | number
  category?: string | number
  provider?: string | number
}

interface Inputs extends PWAProductsProps {
  cash: SelectProps | null
  productRv: SelectProps | null
  category: SelectProps | null
  provider: SelectProps | null
}

export function Sheet({
  open,
  onClosed,
  prpw_descricao,
  prpw_valor,
  prpw_imagem,
  prpw_ativo,
  cash,
  productRv,
  category,
  provider,
}: SheetProps) {
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

  const { setLoading } = useLoading()

  async function handleUpdateProductMax(data: Inputs) {
    setLoading(true)
    data.prpw_cash_id = Number(data.cash?.value)
    data.prpw_prrv_id = Number(data.productRv?.value)
    data.prpw_pcpw_id = Number(data.category?.value)
    data.prpw_fopw_id = Number(data.provider?.value)

    // await addPWAProduct(data)

    setLoading(false)
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
    setValue('prpw_descricao', prpw_descricao ?? null)
    setValue('prpw_valor', FormataValorMonetario(prpw_valor, false) ?? null)
    setValue('prpw_imagem', prpw_imagem ?? '')
    setValue('prpw_ativo', prpw_ativo ?? false)

    setValue(
      'provider',
      optionsProviders?.find((e) => e.value === provider) ?? null,
    )
    setValue(
      'productRv',
      optionsProductsRV?.find((e) => e.value === productRv) ?? null,
    )
    setValue('cash', optionsCashback?.find((e) => e.value === cash) ?? null)
    setValue(
      'category',
      optionsCategories?.find((e) => e.value === category) ?? null,
    )
  }, [
    open,
    prpw_descricao,
    prpw_valor,
    prpw_imagem,
    prpw_ativo,
    cash,
    productRv,
    category,
    provider,
    optionsCashback,
    optionsProviders,
    optionsCategories,
    optionsProductsRV,
  ])

  return (
    <Transition
      className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-opacity"
      show={open}
      enter="transition-all ease-in-out duration-75 delay-75"
      enterFrom="opacity-0 -translate-x-12"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all ease-in-out duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed right-0 top-0 z-50 flex h-full w-3/4 flex-col items-center bg-white dark:bg-black">
        {(isLoading ||
          isFetching ||
          isLoading2 ||
          isFetching2 ||
          isLoading3 ||
          isFetching3 ||
          isLoading4 ||
          isFetching4) && <Loader />}
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
          <TextAction size="lg">Sincronizar produto com o PWA</TextAction>
          <FormProvider {...formProduct}>
            <form
              className="mt-4 w-full space-y-2"
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
                  name="productRv"
                  options={[]}
                />
                <Select
                  control={control}
                  label="Fornecedor"
                  name="provider"
                  options={[]}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  control={control}
                  label="Cashback"
                  name="cash"
                  options={[]}
                />
                <Select
                  control={control}
                  label="Categoria"
                  name="category"
                  options={[]}
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
                      // onChange={getImage}
                    />
                  </div>
                </div>
                <Switch name="prpw_ativo" label="Produto ativo" />
              </div>
              <div className="absolute bottom-2 w-[98%] border-t border-border pt-1">
                <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                  <FloppyDiskBack size={18} weight="fill" />
                  Cadastrar produto
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Transition>
  )
}
