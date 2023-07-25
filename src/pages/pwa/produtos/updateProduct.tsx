import { ChangeEvent, useEffect, useState } from 'react'
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
import { addMaxProduct, updateMaxProduct } from '../../../services/max/products'
import { addPWACategories } from '../../../services/pwa/categories'
import {
  addCategoriesInProduct,
  addPWAProduct,
  removeCategoriesInProduct,
  updatePWAProduct,
} from '../../../services/pwa/products'
import { addPWAProviders } from '../../../services/pwa/providers'

import { useEditProductPWAStore } from '../../../store/useEditProductPWAStore'

import { MaxProductsProps } from '../../../@types/max/products'
import { PWAProductsProps } from '../../../@types/pwa/products'
import { SelectProps } from '../../../@types/select'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import {
  FormataValorMonetario,
  formataMoedaPFloat,
} from '../../../functions/currency'
import { getBase64, handleUploadImage } from '../../../functions/general'
import { useProductsPWA } from '../../../hooks/useProductsPWA'
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
  productMaxAux: any
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

  const { allProductMax } = useEditProductPWAStore()

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  const {
    ProductsMax,
    ProductsRV,
    CategoriesPWA,
    ProvidersPWA,
    CategoriesOfProducts,
    isFetchedAfterMountCategoriesOfProducts,
    loading,
    optionsCashback,
    optionsCategories,
    optionsProductsMax,
    optionsProductsRV,
    optionsProviders,
    refetchCategories,
    refetchProviders,
    refetchProductsMax,
    ProvidersRV,
  } = useProductsPWA(location?.state?.prpw_id)

  async function handleUpdateProductMax(data: Inputs) {
    setLoading(true)

    const { prpw_descricao, prpw_valor, prpw_ativo } = dirtyFields
    if (
      (prpw_descricao || prpw_valor || prpw_ativo) &&
      data.productMax &&
      data.productMax?.value !== -1 &&
      location.state
    ) {
      const productMax = ProductsMax?.find(
        (e) => Number(e.id) === Number(data.productMax?.value),
      )
      if (productMax) {
        productMax.status = prpw_ativo ? data?.prpw_ativo : productMax.status
        productMax.preco = prpw_valor
          ? formataMoedaPFloat(data?.prpw_valor)
          : formataMoedaPFloat(FormataValorMonetario(productMax.preco, false))
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

    if (data.productMax && Number(data.productMax?.value) === -1) {
      const newProductMax = getValues('productMaxAux')
      const resNewProductMax = await addMaxProduct(newProductMax)
      data.productMax.value = resNewProductMax.fopw_id
    }

    if (data.provider && Number(data.provider?.value) === -1) {
      const newProvider = getValues('providerAux')
      const resNewProvider = await addPWAProviders(newProvider)
      data.provider.value = resNewProvider.fopw_id
    }

    if (data.category && Number(data.category?.value) === -1) {
      const newCategory = getValues('categoryAux')
      const resNewProvider = await addPWACategories(newCategory)
      data.category.value = resNewProvider.fopw_id
    }

    data.prpw_cash_id = Number(data.cash?.value)
    data.prpw_prrv_id = Number(data.productRv?.value)
    data.prpw_max_id = Number(data.productMax?.value)
    data.prpw_pcpw_id = Number(data.category?.value)
    data.prpw_fopw_id = Number(data.provider?.value)
    let res = null as PWAProductsProps | null
    let message = 'Produto adicionado com sucesso'
    if (location.state) {
      message = 'Produto atualizado com sucesso'
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

      alerta(message, 1)
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
      refetchProductsMax()

      if (res) {
        setValue('productMax', { value: Number(res.id), label: res.nome })
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
    const inputElem = document.getElementById(
      'imageProductFile',
    ) as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
    setLoading(false)
  }

  function handleChangeProductRV(e: SelectProps) {
    setValue('productRv', e)
    const productRvSelected = watch('productRv')?.value
    if (productRvSelected) {
      const product = ProductsRV?.find((e) => e.prrv_id === productRvSelected)

      let provider = ProvidersPWA?.find(
        (e) => e.fopw_forv_id === product?.prrv_forv_id,
      ) as any
      provider = optionsProviders?.find((e) => e.value === provider?.fopw_id)

      let category = CategoriesPWA?.find(
        (e) => e.pcpw_descricao === product?.pcrv_kind,
      ) as any

      category = optionsCategories?.find((e) => e.value === category?.pcpw_id)

      const productOnMax = optionsProductsMax?.find(
        (e) => e.value === product?.prrv_max_id,
      )

      if (productOnMax) {
        setValue('productMax', productOnMax)
      } else if (product?.prrv_max_id) {
        setValue('productMax', {
          value: -1,
          label: 'Cadastrar automaticamente',
        })
        setValue('productMaxAux', {
          nome: product.prrv_nome,
          preco: formataMoedaPFloat(
            FormataValorMonetario(product.prrv_valor, false),
          ),
          status: true,
        })
      }

      if (provider) {
        setValue('provider', provider)
      } else if (product?.prrv_forv_id) {
        setValue('provider', {
          value: -1,
          label: 'Cadastrar automaticamente',
        })
        const dataNewProvider = ProvidersRV?.find(
          (e) => e.forv_id === product?.prrv_forv_id,
        )

        setValue('providerAux', {
          fopw_nome: dataNewProvider?.forv_provider,
          fopw_forv_id: dataNewProvider?.forv_id,
          fopw_descricao: dataNewProvider?.forv_descricao,
          fopw_termos_condicoes: dataNewProvider?.forv_termos_condicoes,
          fopw_instrucoes: dataNewProvider?.forv_instrucoes,
          fopw_imagem: dataNewProvider?.forv_logo,
          fopw_ativo: true,
        })
      }

      if (category) {
        setValue('category', category)
      } else if (product?.prrv_pcrv_id) {
        setValue('category', {
          value: -1,
          label: 'Cadastrar automaticamente',
        })
        setValue('categoryAux', {
          pcpw_descricao: product.pcrv_kind,
          pcpw_rv_id: product.prrv_pcrv_id,
          pcpw_ativo: true,
        })
      }
      setValue('prpw_descricao', String(product?.prrv_nome))
      setValue('prpw_valor', FormataValorMonetario(product?.prrv_valor, false))
      setValue('prpw_ativo', product?.prrv_ativo || false)
    }
  }

  useEffect(() => {
    const checkTypeof = {
      prpw_valor: true,
    }

    if (location?.state?.product) {
      const productEdit = Object.keys(location.state.product)

      productEdit?.forEach((productItem) => {
        if (productItem !== 'prpw_imagem') {
          // @ts-expect-error
          if (checkTypeof[String(productItem)]) {
            setValue(
              // @ts-expect-error
              String(productItem),
              FormataValorMonetario(location.state.product[productItem], false),
            )
          } else {
            // @ts-expect-error
            setValue(String(productItem), location.state.product[productItem])
          }
        }
      })
      const resImage = new Image()
      resImage.src = location.state.product.prpw_imagem
      resImage.onload = function () {
        setValue('prpw_imagem', location.state.product.prpw_imagem)
      }
      resImage.onerror = function () {
        setValue('prpw_imagem', null)
      }
      setValue(
        'productRv',
        optionsProductsRV?.find(
          (e) => e.value === location.state.product.prpw_prrv_id,
        ) ?? null,
      )

      const currentMax = allProductMax?.find(
        (e) => Number(e.id) === Number(location?.state?.productMax),
      )
      if (location?.state?.productMax && currentMax) {
        setValue('productMax', {
          value: Number(currentMax?.id),
          label: currentMax?.nome,
        })
      }
      setValue(
        'provider',
        optionsProviders?.find(
          (e) => e.value === location.state.product.prpw_fopw_id,
        ) ?? null,
      )
      setValue(
        'cash',
        optionsCashback?.find(
          (e) => e.value === location.state.product.prpw_cash_id,
        ) ?? null,
      )
      setValue(
        'category',
        optionsCategories?.find(
          (e) => e.value === location.state.product.prpw_pcpw_id,
        ) ?? null,
      )

      if (isFetchedAfterMountCategoriesOfProducts) {
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
      {loading() && <Loader />}
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
                onChange={(e: any) => handleChangeProductRV(e)}
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
                {!location?.state && !watch('productMax') && (
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
                    htmlFor="imageProductFile"
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
                    id="imageProductFile"
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
        onSuccess={(res) => {
          setIsOpenForm(false)
          refetchCategories()
          if (res) {
            setValue('category', {
              value: res?.pcpw_id,
              label: res?.pcpw_descricao,
            })
          }
        }}
      />
      <FormProviderPWA
        optionsCashback={optionsCashback}
        open={isOpenFormProvider}
        closeDialog={() => setIsOpenFormProvider(false)}
        onSuccess={(res) => {
          setIsOpenFormProvider(false)
          refetchProviders()
          if (res) {
            setValue('provider', {
              value: res?.fopw_id,
              label: res?.fopw_nome,
            })
          }
        }}
      />
    </Container>
  )
}
