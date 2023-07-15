import { ChangeEvent, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { ButtonText } from '../../../components/Form/ButtonText'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { Textarea } from '../../../components/Form/Textarea'
import { FormCategoryPWA } from '../../../components/Pages/PWA/FormCategoryPWA'
import { alerta } from '../../../components/System/Alert'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextAction } from '../../../components/Texts/TextAction'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import {
  addCategoriesInProvider,
  removeCategoriesInProvider,
} from '../../../services/pwa/categories'
import {
  addPWAProviders,
  updatePWAProviders,
} from '../../../services/pwa/providers'

import { PWAProvidersProps } from '../../../@types/pwa/providers'
import { SelectProps } from '../../../@types/select'

import useLoading from '../../../contexts/LoadingContext'
import {
  checkIfImage,
  getBase64,
  handleUploadImage,
} from '../../../functions/general'
import { useProviderPWA } from '../../../hooks/useProviderPWA'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  PlusSquare,
  Storefront,
} from '@phosphor-icons/react'
import clsx from 'clsx'

interface Inputs extends PWAProvidersProps {
  providerRv: SelectProps | null
  cash: SelectProps | null
  imagem_aux: File
}

export default function UpdateProviderPWA() {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const formProvider = useForm<Inputs>()
  const { handleSubmit, setValue, watch, control } = formProvider

  const router = useNavigate()
  const location = useLocation()
  const { setLoading } = useLoading()

  const {
    ProvidersOfCategories,
    isFetchedAfterMountProvidersOfCategories,
    loading,
    optionsCashback,
    optionsCategories,
    optionsProvidersRV,
    refetchCategories,
  } = useProviderPWA(location?.state?.fopw_id)

  async function handleUpdateProviderPWA(data: Inputs) {
    setLoading(true)
    const imageAnexed = watch('imagem_aux')
    if (imageAnexed) {
      data.fopw_imagem = await uploadImages(imageAnexed)
    } else {
      data.fopw_imagem = watch('fopw_imagem')
    }

    data.fopw_forv_id = Number(data.providerRv?.value)
    data.fopw_cash_id = Number(data.cash?.value)

    let message = 'Fornecedor adicionado com sucesso'
    let res = null as PWAProvidersProps | null

    if (location.state) {
      message = 'Fornecedor alterado com sucesso'
      res = await updatePWAProviders(data)
    } else {
      res = await addPWAProviders(data)
    }

    optionsCategories.forEach(async (category) => {
      // @ts-expect-error
      const fieldValue = watch(`optionsCategories-${category.value}`)
      const currentCategory = ProvidersOfCategories?.find(
        (e) => e.fopc_pcpw_id === category.value,
      )

      if (!currentCategory && fieldValue) {
        await addCategoriesInProvider({
          prpc_pcpw_id: category.value,
          fopc_fopw_id: Number(res?.fopw_id),
        })
      } else if (currentCategory && !fieldValue) {
        await removeCategoriesInProvider(currentCategory?.fopc_id)
      }
    })

    alerta(message, 1)
    setTimeout(() => {
      router('/pwa/fornecedores')
    }, 400)

    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('fopw_imagem', imageFinal)
      setValue('imagem_aux', res)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  useEffect(() => {
    if (location.state) {
      const providerEdit = Object.keys(location.state)

      providerEdit?.forEach((providerItem) => {
        if (providerItem === 'fopw_imagem') {
          const resImage = checkIfImage(location.state[providerItem])

          if (resImage) {
            setValue('fopw_imagem', location.state[providerItem])
          } else {
            setValue('fopw_imagem', null)
          }
        } else {
          // @ts-expect-error
          setValue(String(providerItem), location.state[providerItem])
        }
      })
      setValue(
        'providerRv',
        optionsProvidersRV?.find(
          (e) => e.value === location.state.fopw_forv_id,
        ) ?? null,
      )
      setValue(
        'cash',
        optionsCashback?.find((e) => e.value === location.state.fopw_cash_id) ??
          null,
      )
      if (isFetchedAfterMountProvidersOfCategories) {
        ProvidersOfCategories?.forEach((item) => {
          // @ts-expect-error
          setValue(`optionsCategories-${item.fopc_pcpw_id}`, true)
        })
      }
    }
  }, [location, optionsCashback, optionsProvidersRV, ProvidersOfCategories])

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
                ? 'Fornecedores PWA / Editar fornecedor'
                : 'Fornecedores PWA / Adicionar fornecedor'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formProvider}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateProviderPWA)}
          >
            <div className="flex gap-2">
              <Input name="fopw_nome" label="Nome" />
              <Input name="fopw_descricao" label="Descrição" />
            </div>

            <div className="flex gap-2">
              <Select
                control={control}
                label="Fornecedor RV"
                name="providerRv"
                options={optionsProvidersRV}
              />
              <Select
                control={control}
                label="Cashback"
                name="cash"
                options={optionsCashback}
              />
            </div>
            <div className="flex gap-2">
              <Textarea name="fopw_instrucoes" label="Instruções" rows={8} />
              <Textarea
                name="fopw_termos_condicoes"
                label="Termos e condições"
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <TextAction className="col-span-2 text-sm font-medium text-black dark:text-white">
                    Categorias vínculadas a esse fornecedor
                  </TextAction>
                  <ButtonText onClick={() => setIsOpenForm(true)} type="button">
                    Adicionar categoria <PlusSquare size={20} weight="fill" />
                  </ButtonText>
                </div>
                <div className="flex flex-wrap gap-2">
                  {optionsCategories.map((item) => (
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
                  ))}
                </div>
              </div>

              <Switch name="fopw_ativo" label="Ativo" />
            </div>
            <div className="w-full">
              <div className="flex items-end gap-4">
                {!watch('fopw_imagem') && (
                  <Icon>
                    <Storefront size={96} />
                  </Icon>
                )}

                {watch('fopw_imagem') && (
                  <img
                    src={watch('fopw_imagem') ?? ''}
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
                      {!watch('fopw_imagem')
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
              <Button onClick={() => handleSubmit(handleUpdateProviderPWA)}>
                <FloppyDiskBack size={18} weight="fill" />
                {location.state
                  ? 'Atualizar fornecedor'
                  : 'Adicionar fornecedor'}
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
    </Container>
  )
}
