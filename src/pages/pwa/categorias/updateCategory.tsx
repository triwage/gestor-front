import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { ButtonText } from '../../../components/Form/ButtonText'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { FormProviderPWA } from '../../../components/Pages/PWA/FormProviderPWA'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import {
  addCategoriesInProvider,
  addPWACategories,
  removeCategoriesInProvider,
  updatePWACategory,
} from '../../../services/pwa/categories'

import { PWACategoriesProps } from '../../../@types/pwa/categories'
import { SelectProps } from '../../../@types/select'

import useLoading from '../../../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../../../functions/general'
import { useCategoriesPWA } from '../../../hooks/useCategoriesPWA'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  ImageSquare,
  Images,
  PlusSquare,
} from '@phosphor-icons/react'
import clsx from 'clsx'

interface Inputs extends PWACategoriesProps {
  cash: SelectProps | null
  categoryRv: SelectProps | null
  categoria_operacao: SelectProps | null
  imagem_aux: File
}

export default function UpdateCategoryPWA() {
  const [isOpenForm, setIsOpenForm] = useState(false)

  const formCategory = useForm<Inputs>()
  const { handleSubmit, setValue, watch, control } = formCategory

  const router = useNavigate()
  const location = useLocation()

  const {
    CategoriesRV,
    CategoriesOfProviders,
    isFetchedAfterMount,
    loading,
    optionsCashback,
    optionsCategoriesRV,
    optionsProviders,
    optionsDefaultOperationsCategories,
    refetch,
  } = useCategoriesPWA(location?.state?.pcpw_id)

  const { setLoading } = useLoading()

  async function handleUpdateCategoriePWA(data: Inputs) {
    setLoading(true)
    const imageAnexed = watch('imagem_aux')
    if (imageAnexed) {
      data.pcpw_imagem = await uploadImages(imageAnexed)
    } else {
      data.pcpw_imagem = watch('pcpw_imagem')
    }

    data.pcpw_cash_id = Number(data.cash?.value)
    data.pcpw_rv_id = Number(data.categoryRv?.value)
    data.pcpw_categoria_operacao = String(data.categoria_operacao?.label)
    let message = 'Categoria criada com sucesso'
    let res = null as PWACategoriesProps | null
    if (location.state) {
      message = 'Categoria alterada com sucesso'
      res = await updatePWACategory(data)
    } else {
      res = await addPWACategories(data)
    }

    optionsProviders.forEach(async (provider) => {
      // @ts-expect-error
      const fieldValue = watch(`optionsProviders-${provider.value}`)
      const currentProvider = CategoriesOfProviders?.find(
        (e) => e.fopc_fopw_id === provider.value,
      )
      if (!currentProvider && fieldValue) {
        await addCategoriesInProvider({
          fopc_fopw_id: provider.value,
          prpc_pcpw_id: Number(res?.pcpw_id),
        })
      } else if (currentProvider && !fieldValue) {
        await removeCategoriesInProvider(currentProvider?.fopc_id)
      }
    })

    alerta(message, 1)
    setTimeout(() => {
      router('/pwa/categorias')
    }, 400)

    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('pcpw_imagem', imageFinal)
      setValue('imagem_aux', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function handleChangeCategorieRV(e: SelectProps) {
    setValue('categoryRv', e)
    const categoryRvSelected = watch('categoryRv')?.value

    if (categoryRvSelected) {
      const currentCategory = CategoriesRV?.find(
        (e) => e.pcrv_id === categoryRvSelected,
      )

      setValue(
        'categoria_operacao',
        optionsDefaultOperationsCategories.find(
          (e) => e.label === currentCategory?.pcrv_categoria_operacao,
        ) || null,
      )

      setValue('pcpw_descricao', currentCategory?.pcrv_kind || '')
      setValue('pcpw_ativo', true)
    }
  }

  useEffect(() => {
    if (location.state) {
      const categoryEdit = Object.keys(location.state)

      categoryEdit?.forEach((categoryItem) => {
        if (categoryItem !== 'pcpw_imagem') {
          // @ts-expect-error
          setValue(String(categoryItem), location.state[categoryItem])
        }
      })
      const resImage = new Image()
      resImage.src = location?.state?.pcpw_imagem
      resImage.onload = function () {
        setValue('pcpw_imagem', location?.state?.pcpw_imagem)
      }
      resImage.onerror = function () {
        setValue('pcpw_imagem', null)
      }

      setValue(
        'cash',
        optionsCashback?.find((e) => e.value === location.state.pcpw_cash_id) ??
          null,
      )

      setValue(
        'categoryRv',
        optionsCategoriesRV?.find(
          (e) => e.value === location.state.pcpw_rv_id,
        ) ?? null,
      )

      setValue(
        'categoria_operacao',
        optionsDefaultOperationsCategories?.find(
          (e) => e.label === location.state.pcpw_categoria_operacao,
        ) ?? null,
      )

      if (isFetchedAfterMount) {
        CategoriesOfProviders?.forEach((item) => {
          // @ts-expect-error
          setValue(`optionsProviders-${item.fopc_fopw_id}`, true)
        })
      }
    }
  }, [
    location,
    optionsCashback,
    CategoriesOfProviders,
    optionsDefaultOperationsCategories,
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
                ? 'Categorias PWA / Editar categoria'
                : 'Categorias PWA / Adicionar categoria'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formCategory}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateCategoriePWA)}
          >
            <div className="flex gap-2">
              <Select
                control={control}
                label="Categoria da RV"
                name="categoryRv"
                options={optionsCategoriesRV}
                onChange={(e: any) => handleChangeCategorieRV(e)}
              />
              <Input name="pcpw_descricao" label="Nome" />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Select
                control={control}
                label="Cashback"
                name="cash"
                options={optionsCashback}
              />
              <Select
                control={control}
                label="Categoria padrão"
                name="categoria_operacao"
                options={optionsDefaultOperationsCategories}
              />

              <Switch name="pcpw_ativo" label="Ativo" />
            </div>

            <div className="grid grid-cols-2 items-start gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <TextAction className="col-span-2 text-sm font-medium text-black dark:text-white">
                    Fornecedores vínculados a essa categoria
                  </TextAction>
                  <ButtonText onClick={() => setIsOpenForm(true)} type="button">
                    Adicionar fornecedor{' '}
                    <Icon>
                      <PlusSquare size={20} weight="fill" />
                    </Icon>
                  </ButtonText>
                </div>
                <div className="flex flex-wrap gap-2">
                  {optionsProviders.map((item) => (
                    <div
                      onClick={() =>
                        setValue(
                          // @ts-expect-error
                          String(`optionsProviders-${item.value}`),
                          // @ts-expect-error
                          !watch(String(`optionsProviders-${item.value}`)),
                        )
                      }
                      key={item.value}
                      className={clsx(
                        'flex cursor-pointer select-none items-center justify-center rounded-xl border px-2 py-1 text-sm',
                        {
                          'border-primary bg-white text-primary dark:border-border-500 dark:bg-white-200/10 dark:text-white':
                            !watch(
                              // @ts-expect-error
                              String(`optionsProviders-${item.value}`),
                            ),
                          'border-primary bg-primary text-white': watch(
                            // @ts-expect-error
                            String(`optionsProviders-${item.value}`),
                          ),
                        },
                      )}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-end gap-4">
                {!watch('pcpw_imagem') && (
                  <Icon>
                    <ImageSquare size={96} weight="fill" />
                  </Icon>
                )}

                {watch('pcpw_imagem') && (
                  <img
                    src={watch('pcpw_imagem') ?? ''}
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
                      {!watch('pcpw_imagem')
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
                disable={location?.state?.categoria_padrao}
                onClick={() => handleSubmit(handleUpdateCategoriePWA)}
              >
                <FloppyDiskBack size={18} weight="fill" />
                {location.state ? 'Atualizar categoria' : 'Adicionar categoria'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <FormProviderPWA
        optionsCashback={optionsCashback}
        open={isOpenForm}
        closeDialog={() => setIsOpenForm(false)}
        onSuccess={() => {
          setIsOpenForm(false)
          refetch()
        }}
      />
    </Container>
  )
}
