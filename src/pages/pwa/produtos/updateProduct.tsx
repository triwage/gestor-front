import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { addMaxProduct, useMaxProducts } from '../../../services/max/products'
import { usePWACashback } from '../../../services/pwa/cashback'
import { usePWACategories } from '../../../services/pwa/categories'
import {
  addCategoriesInProduct,
  addPWAProduct,
  removeCategoriesInProduct,
  updatePWAProduct,
  usePWACategoriesOfProdutos,
} from '../../../services/pwa/products'
import { usePWAProviders } from '../../../services/pwa/providers'
import { useRVProducts } from '../../../services/rv/products'

import { MaxProductsProps } from '../../../@types/max/products'
import { PWAProductsProps } from '../../../@types/pwa/products'
import { SelectProps } from '../../../@types/select'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  Package,
} from '@phosphor-icons/react'
import clsx from 'clsx'
import * as yup from 'yup'

interface Inputs extends PWAProductsProps {
  cash: SelectProps | null
  productRv: SelectProps | null
  productMax: SelectProps | null
  category: SelectProps | null
  provider: SelectProps | null
}

const schemaProduct = yup
  .object({
    prpw_descricao: yup.string().required('Informe o nome'),
    prpw_valor: yup.string().required('Informe um valor'),
  })
  .required()

export default function UpdateProductPWA() {
  const formProduct = useForm<Inputs>({
    // @ts-expect-error
    resolver: yupResolver(schemaProduct),
  })
  const { handleSubmit, setValue, watch, control } = formProduct

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

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
    refetch,
  } = useMaxProducts()
  const {
    data: CategoriesOfProducts,
    isLoading: isLoading6,
    isFetching: isFetching6,
    isFetchedAfterMount,
  } = usePWACategoriesOfProdutos(location?.state?.prpw_id)

  async function handleUpdateProductMax(data: Inputs) {
    setLoading(true)

    data.prpw_cash_id = Number(data.cash?.value)
    data.prpw_prrv_id = Number(data.productRv?.value)
    data.prpw_max_id = Number(data.productMax?.value)
    data.prpw_pcpw_id = Number(data.category?.value)
    data.prpw_fopw_id = Number(data.provider?.value)
    let res = null as PWAProductsProps | null
    if (location.state) {
      res = await updatePWAProduct(data)
    } else {
      res = await addPWAProduct(data)
    }

    if (res) {
      optionsCategories.forEach(async (category) => {
        if (data.prpw_pcpw_id !== category.value) {
          // @ts-expect-error
          const fieldValue = watch(`optionsCategories-${category.value}`)
          const currentCategory = CategoriesOfProducts?.find(
            (e) => e.prpc_pcpw_id === category.value,
          )

          if (!currentCategory && fieldValue) {
            await addCategoriesInProduct({
              prpc_pcpw_id: category.value,
              prpc_prpw_id: Number(res?.prpw_id),
            })
          } else if (currentCategory && !fieldValue) {
            await removeCategoriesInProduct(currentCategory?.prpc_id)
          }
        }
      })

      alerta('Produto adicionado com sucesso', 1)
      setTimeout(() => {
        router('/pwa/produtos')
      }, 400)
    }

    setLoading(false)
  }

  async function handleAddProductInMax() {
    const check = await Confirm({
      title: 'Adicionar produto',
      message: 'Tem certeza que deseja adicionar um novo produto na max nível?',
      confirm: 'Adicionar',
    })

    if (check) {
      setLoading(true)
      const nome = String(watch('prpw_descricao'))
      const preco = String(watch('prpw_valor'))

      const data = {
        id: '',
        nome,
        descricao: '',
        imagem_padrao_url: null,
        preco,
        status: '1',
      }
      const res = (await addMaxProduct(data)) as MaxProductsProps
      refetch()
      if (res) {
        setValue(
          'productMax',
          optionsProductsMax?.find((e) => e.value === Number(res.id)) ?? null,
        )
      }
      setLoading(false)
    }
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

      if (isFetchedAfterMount) {
        CategoriesOfProducts?.forEach((item) => {
          // @ts-expect-error
          setValue(`optionsCategories-${item.prpc_pcpw_id}`, true)
        })
      }
    }
  }, [
    location,
    optionsCashback,
    optionsProviders,
    optionsCategories,
    optionsProductsRV,
    optionsProductsMax,
    CategoriesOfProducts,
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
        isFetching5 ||
        isLoading6 ||
        isFetching6) && <Loader />}
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
                {!location?.state ||
                  (!watch('productMax') && (
                    <div className="mt-4 w-[80px]">
                      <Button
                        type="button"
                        onClick={handleAddProductInMax}
                        title="Adicionar novo produto na Max nível"
                        disable={
                          !watch('prpw_descricao') || !watch('prpw_valor')
                        }
                      >
                        +
                      </Button>
                    </div>
                  ))}
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
            <div className="flex flex-col gap-0.5">
              <TextAction className="text-sm font-medium text-black dark:text-white">
                Outras categorias
              </TextAction>
              <div className="flex flex-wrap gap-2">
                {optionsCategories.map(
                  (item) =>
                    watch('category')?.value !== item.value && (
                      <div
                        onClick={() =>
                          setValue(
                            // @ts-expect-error
                            String(`optionsCategories-${item.value}`),
                            // @ts-expect-error
                            !watch(String(`optionsCategories-${item.value}`)),
                          )
                        }
                        key={item.value}
                        className={clsx(
                          'flex cursor-pointer select-none items-center justify-center rounded-xl border px-2 py-1 text-sm',
                          {
                            'border-primary bg-white text-primary dark:border-border-500 dark:bg-white-200/10 dark:text-white':
                              !watch(
                                // @ts-expect-error
                                String(`optionsCategories-${item.value}`),
                              ),
                            'border-primary bg-primary text-white': watch(
                              // @ts-expect-error
                              String(`optionsCategories-${item.value}`),
                            ),
                          },
                        )}
                      >
                        {item.label}
                      </div>
                    ),
                )}
              </div>
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
              <Button
                type="submit"
                onClick={() => handleSubmit(handleUpdateProductMax)}
              >
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
