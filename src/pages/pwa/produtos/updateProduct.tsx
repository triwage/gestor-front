import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { FormCategoryPWA } from '../../../components/Pages/PWA/FormCategoryPWA'
import { FormProviderPWA } from '../../../components/Pages/PWA/FormProviderPWA'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import {
  addMaxProduct,
  updateMaxProduct,
  useMaxProducts,
} from '../../../services/max/products'
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
import {
  checkIfImage,
  getBase64,
  handleUploadImage,
} from '../../../functions/general'
import { Container } from '../../../template/Container'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  Package,
  PlusCircle,
} from '@phosphor-icons/react'
import clsx from 'clsx'
import * as yup from 'yup'

interface Inputs extends PWAProductsProps {
  imagem_aux: File
  cash: SelectProps | null
  productRv: SelectProps | null
  productMax: SelectProps | null
  category: SelectProps | null
  categoryAux: any
  provider: SelectProps | null
  providerAux: any
}

const schemaProduct = yup
  .object({
    prpw_descricao: yup.string().required('Informe o nome'),
    prpw_valor: yup.string().required('Informe um valor'),
    productRv: yup.object().required('Selecione um produto da RV'),
    productMax: yup.object().required('Selecione um produto da MAX'),
  })
  .required()

export default function UpdateProductPWA() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenFormProvider, setIsOpenFormProvider] = useState(false)
  const formProduct = useForm<Inputs>({
    // @ts-expect-error
    resolver: yupResolver(schemaProduct),
  })
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    formState: { dirtyFields },
  } = formProduct

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
    refetch: refetchCategories,
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

    const { prpw_descricao, prpw_valor, prpw_ativo } = dirtyFields
    if (prpw_descricao || prpw_valor || prpw_ativo) {
      const productMax = ProductsMax?.find(
        (e) => Number(e.id) === Number(data.productMax?.value),
      )
      if (productMax) {
        productMax.status = prpw_ativo ? data?.prpw_ativo : productMax.status
        productMax.preco = prpw_valor
          ? FormataValorMonetario(data?.prpw_valor, false).replace(',', '.')
          : productMax.preco
        productMax.nome =
          prpw_descricao && data?.prpw_descricao
            ? data?.prpw_descricao
            : productMax.nome
        await updateMaxProduct(productMax)
      }
    }

    const imageAnexed = watch('imagem_aux')
    if (imageAnexed) {
      data.prpw_imagem = await uploadImages(imageAnexed)
    } else {
      data.prpw_imagem = watch('prpw_imagem')
    }

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
    setLoading(true)
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('prpw_imagem', imageFinal)
      setValue('imagem_aux', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
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
    const productRvSelected = watch('productRv')?.value
    if (productRvSelected) {
      const product = ProductsRV?.find((e) => e.prrv_id === productRvSelected)
      console.log(product)

      const provider = optionsProviders?.find(
        (e) => e.value === product?.prrv_forv_id,
      )
      const productOnMax = optionsProductsMax?.find(
        (e) => e.value === product?.prrv_max_id,
      )
      if (productOnMax) {
        setValue('productMax', productOnMax)
      }
      if (provider) {
        setValue('provider', provider)
      } else if (product?.prrv_forv_id) {
        setValue('provider', {
          value: 999,
          label: 'Cadastrar um novo automaticamente',
        })
        setValue('providerAux', {
          fopw_nome: product.forv_provider,
          fopw_forv_id: product?.prrv_forv_id,
          fopw_ativo: true,
        })
      }

      if (product?.prrv_pcrv_id) {
        setValue('category', {
          value: 999,
          label: 'Cadastrar um novo automaticamente',
        })
        setValue('categoryAux', {
          pcpw_descricao: product.pcrv_kind,
          pcpw_ativo: true,
        })
      }
      setValue('prpw_descricao', String(product?.prrv_nome))
      setValue('prpw_valor', FormataValorMonetario(product?.prrv_valor, false))
      setValue('prpw_ativo', product?.prrv_ativo || false)
    }
  }, [watch('productRv')])

  useEffect(() => {
    const checkTypeof = {
      prpw_valor: true,
    }

    if (location.state) {
      const productEdit = Object.keys(location.state)

      productEdit?.forEach((productItem) => {
        if (productItem === 'prpw_imagem') {
          const resImage = checkIfImage(location.state[productItem])

          if (resImage) {
            setValue('prpw_imagem', location.state[productItem])
          } else {
            setValue('prpw_imagem', null)
          }
        } else {
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
              <Select
                control={control}
                label="Produto RV"
                name="productRv"
                options={optionsProductsRV}
              />
              <Input name="prpw_descricao" label="Nome" />
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <InputCurrency name="prpw_valor" label="Preço" />
              <div className="flex items-center gap-2">
                <Select
                  control={control}
                  label="Produto MAX"
                  name="productMax"
                  options={optionsProductsMax}
                />
                {(!location?.state || !watch('productMax')) && (
                  <div className="mt-4 w-[80px]">
                    <Button
                      type="button"
                      onClick={handleAddProductInMax}
                      title="Adicionar novo produto na Max nível"
                      disable={!watch('prpw_descricao') || !watch('prpw_valor')}
                    >
                      <PlusCircle size={20} weight="fill" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="flex items-center gap-2">
                <Select
                  control={control}
                  label="Fornecedor principal"
                  name="provider"
                  options={optionsProviders}
                />
                <div className="mt-4 w-[80px]">
                  <Button
                    onClick={() => setIsOpenFormProvider(true)}
                    type="button"
                    title="Adicionar novo fornecedor"
                  >
                    <PlusCircle size={20} weight="fill" />
                  </Button>
                </div>
              </div>
              <Select
                control={control}
                label="Cashback"
                name="cash"
                options={optionsCashback}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="flex items-center gap-2">
                <Select
                  control={control}
                  label="Categoria principal"
                  name="category"
                  options={optionsCategories}
                />
                <div className="mt-4 w-[80px]">
                  <Button
                    onClick={() => setIsOpenForm(true)}
                    type="button"
                    title="Adicionar nova categoria"
                  >
                    <PlusCircle size={20} weight="fill" />
                  </Button>
                </div>
              </div>
              <Switch name="prpw_ativo" label="Produto ativo" />
            </div>
            <div className="flex flex-col gap-2">
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
                    src={watch('prpw_imagem') ?? ''}
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
      <FormCategoryPWA
        open={isOpenForm}
        closeDialog={() => setIsOpenForm(false)}
        optionsCashback={optionsCashback}
        onSuccess={() => {
          setIsOpenForm(false)
          refetchCategories()
        }}
      />
      <FormProviderPWA
        optionsCashback={optionsCashback}
        open={isOpenFormProvider}
        closeDialog={() => setIsOpenFormProvider(false)}
        onSuccess={() => {
          setIsOpenFormProvider(false)
        }}
      />
    </Container>
  )
}
