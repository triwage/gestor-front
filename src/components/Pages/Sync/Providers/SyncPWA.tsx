import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadImages } from '../../../../services/images'
import { usePWACashback } from '../../../../services/pwa/cashback'

import { PWAProvidersProps } from '../../../../@types/pwa/providers'
import { SelectProps } from '../../../../@types/select'

import useLoading from '../../../../contexts/LoadingContext'
import { handleUploadImage } from '../../../../functions/general'
import { Button } from '../../../Form/Button'
import { Input } from '../../../Form/Input'
import { Select } from '../../../Form/Select'
import { Switch } from '../../../Form/Switch'
import { Textarea } from '../../../Form/Textarea'
import { Icon } from '../../../System/Icon'
import { Loader } from '../../../System/Loader'
import { TextAction } from '../../../Texts/TextAction'
import { Transition } from '@headlessui/react'
import { FloppyDiskBack, Images, UserSquare, X } from '@phosphor-icons/react'

interface SyncPWAProps {
  open: boolean
  onClosed: () => void
  fopw_forv_id?: number
  fopw_nome?: string
  fopw_descricao?: string
  fopw_termos_condicoes?: string
  fopw_instrucoes?: string
  fopw_imagem?: string
}

interface Inputs extends PWAProvidersProps {
  cash: SelectProps | null
}

export function SyncPWA({
  open,
  onClosed,
  fopw_forv_id,
  fopw_nome,
  fopw_descricao,
  fopw_termos_condicoes,
  fopw_instrucoes,
  fopw_imagem,
}: SyncPWAProps) {
  const formProvider = useForm<Inputs>()
  const { handleSubmit, setValue, watch, control } = formProvider

  const { data: CashbackPWA, isLoading, isFetching } = usePWACashback()

  const { setLoading } = useLoading()

  async function handleUpdateProviderPWA(data: Inputs) {
    setLoading(true)
    data.fopw_cash_id = Number(data.cash?.value)
    console.log(data)
    // if (location.state) {
    //   await updatePWAProviders(data)
    // } else {
    //   await addPWAProviders(data)
    // }
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
    setValue('fopw_forv_id', fopw_forv_id ?? null)
    setValue('fopw_nome', fopw_nome ?? '')
    setValue('fopw_descricao', fopw_descricao ?? '')
    setValue('fopw_termos_condicoes', fopw_termos_condicoes ?? '')
    setValue('fopw_instrucoes', fopw_instrucoes ?? '')
    setValue('fopw_imagem', fopw_imagem ?? '')
  }, [
    open,
    fopw_forv_id,
    fopw_nome,
    fopw_descricao,
    fopw_termos_condicoes,
    fopw_instrucoes,
    fopw_imagem,
  ])

  return (
    <Transition
      className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-opacity"
      show={open}
      enter="transition-all ease-in-out duration-200 delay-75"
      enterFrom="opacity-0 -translate-x-12"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all ease-in-out duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed right-0 top-0 z-50 flex h-full w-3/4 flex-col items-center bg-white dark:bg-black">
        {(isLoading || isFetching) && <Loader />}
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
          <TextAction size="lg">Sincronizar fornecedor com o APP</TextAction>
          <FormProvider {...formProvider}>
            <form
              className="mt-4 w-full space-y-2"
              onSubmit={handleSubmit(handleUpdateProviderPWA)}
            >
              <div className="flex gap-2">
                <Input name="fopw_nome" label="Nome" />
                <Input name="fopw_descricao" label="Descrição" />
              </div>

              <div className="flex gap-2">
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
                <Switch name="fopw_ativo" label="Fornecedor ativo" />
              </div>

              <div className="absolute bottom-2 w-[98%] border-t border-border pt-1">
                <Button onClick={() => handleSubmit(handleUpdateProviderPWA)}>
                  <FloppyDiskBack size={18} weight="fill" />
                  Adicionar fornecedor ao APP
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Transition>
  )
}
