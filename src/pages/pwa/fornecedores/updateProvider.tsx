import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Switch } from '../../../components/Form/Switch'
import { Textarea } from '../../../components/Form/Textarea'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { usePWACashback } from '../../../services/pwa/cashback'
import {
  addPWAProviders,
  updatePWAProviders,
} from '../../../services/pwa/providers'
import { useRVProviders } from '../../../services/rv/providers'

import { PWAProvidersProps } from '../../../@types/pwa/providers'
import { SelectProps } from '../../../@types/select'

import useLoading from '../../../contexts/LoadingContext'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  UserSquare,
} from '@phosphor-icons/react'

interface Inputs extends PWAProvidersProps {
  providerRv: SelectProps | null
  cash: SelectProps | null
}

export default function UpdateProviderPWA() {
  const formProvider = useForm<Inputs>()
  const { handleSubmit, setValue, watch, control } = formProvider

  const { setLoading } = useLoading()

  const { data: ProvidersRV, isLoading, isFetching } = useRVProviders()
  const {
    data: CashbackPWA,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWACashback()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProviderPWA(data: Inputs) {
    setLoading(true)
    data.fopw_forv_id = Number(data.providerRv?.value)
    data.fopw_cash_id = Number(data.cash?.value)

    if (location.state) {
      await updatePWAProviders(data)
    } else {
      await addPWAProviders(data)
    }
    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageCloud = await uploadImages(res)
      setValue('fopw_imagem', imageCloud)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  const optionsProvidersRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProvidersRV) {
      res = ProvidersRV?.map((item) => {
        return {
          value: item.forv_id,
          label: item.forv_provider,
        }
      })
    }
    return res
  }, [ProvidersRV])

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

  useEffect(() => {
    if (location.state) {
      const providerEdit = Object.keys(location.state)

      providerEdit?.forEach((providerItem) => {
        // @ts-expect-error
        setValue(String(providerItem), location.state[providerItem])
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
    }
  }, [location, optionsCashback, optionsProvidersRV])

  return (
    <Container>
      {(isLoading || isFetching || isLoading2 || isFetching2) && <Loader />}
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
              <div className="flex items-end gap-4">
                {!watch('fopw_imagem') && (
                  <Icon>
                    <UserSquare size={96} weight="fill" />
                  </Icon>
                )}

                {watch('fopw_imagem') && (
                  <img
                    src={watch('fopw_imagem')}
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
              <Switch name="fopw_ativo" label="Ativo" />
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
    </Container>
  )
}
