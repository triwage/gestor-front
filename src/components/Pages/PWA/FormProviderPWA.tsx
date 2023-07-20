import { ChangeEvent, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadImages } from '../../../services/images'
import { addPWAProviders } from '../../../services/pwa/providers'
import { useRVProviders } from '../../../services/rv/providers'

import { PWAProvidersProps } from '../../../@types/pwa/providers'
import { SelectProps } from '../../../@types/select'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../../../functions/general'
import { Button } from '../../Form/Button'
import { Input } from '../../Form/Input'
import { OptionsSelectProps, Select } from '../../Form/Select'
import { Switch } from '../../Form/Switch'
import { Textarea } from '../../Form/Textarea'
import { alerta } from '../../System/Alert'
import { Dialog } from '../../System/Dialog'
import { Icon } from '../../System/Icon'
import { Loader } from '../../System/Loader'
import { TextAction } from '../../Texts/TextAction'
import { FloppyDiskBack, Images, ImagesSquare } from '@phosphor-icons/react'

interface InputsProvider extends PWAProvidersProps {
  providerRv: SelectProps | null
  cash: SelectProps | null
  imagem_aux: File
}

interface FormProviderProps {
  open: boolean
  closeDialog: () => void
  optionsCashback: OptionsSelectProps[]
  onSuccess: (res?: PWAProvidersProps | null) => void
}

export function FormProviderPWA({
  open,
  closeDialog,
  optionsCashback,
  onSuccess,
}: FormProviderProps) {
  const formProvider = useForm<InputsProvider>()
  const { handleSubmit, watch, control, setValue } = formProvider

  const { data: ProvidersRV, isLoading, isFetching } = useRVProviders()

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

  const { Confirm } = useConfirm()
  const { setLoading } = useLoading()

  async function handleCreateProviderPWA(data: InputsProvider) {
    setLoading(true)
    const imageAnexed = watch('imagem_aux')
    if (imageAnexed) {
      data.fopw_imagem = await uploadImages(imageAnexed)
    } else {
      data.fopw_imagem = watch('fopw_imagem')
    }

    data.fopw_forv_id = Number(data.providerRv?.value)
    data.fopw_cash_id = Number(data.cash?.value)

    const res = await addPWAProviders(data)

    alerta('Fornecedor adicionado com sucesso', 1)
    setLoading(false)
    onSuccess(res)
  }

  async function getImageProvider(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('fopw_imagem', imageFinal)
      setValue('imagem_aux', res)
    }
    const inputElem = document.getElementById(
      'newFileProviderModal',
    ) as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  return (
    <Dialog
      open={open}
      closeDialog={async () => {
        const check = await Confirm({
          title: 'Operação em andamento',
          message: 'Ao sair perderá os dados já informados, tem certeza disso?',
        })
        if (check) {
          closeDialog()
        }
      }}
    >
      {(isLoading || isFetching) && <Loader />}
      <FormProvider {...formProvider}>
        <form
          className="mb-2 flex w-full flex-col items-center gap-2 p-4"
          onSubmit={handleSubmit(handleCreateProviderPWA)}
        >
          <TextAction className="mb-6 font-semibold">
            Cadastrar novo fornecedor
          </TextAction>
          <div className="flex w-full gap-2">
            <Input name="fopw_nome" label="Nome" />
            <Input name="fopw_descricao" label="Descrição" />
          </div>

          <div className="flex w-full gap-2">
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
          <div className="flex w-full gap-2">
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
                  <ImagesSquare size={96} weight="fill" />
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
                  htmlFor="newFileProviderModal"
                  className="flex w-max cursor-pointer flex-col"
                >
                  <div className="flex select-none items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                    <Images size={20} weight="fill" />
                    Adicionar imagem
                  </div>
                </label>
                <input
                  className="hidden"
                  id="newFileProviderModal"
                  type="file"
                  accept="image/*"
                  onChange={getImageProvider}
                />
              </div>
            </div>
            <Switch name="fopw_ativo" label="Ativo" />
          </div>

          <div className="w-full border-t border-border pt-1">
            <Button onClick={() => handleSubmit(handleCreateProviderPWA)}>
              <FloppyDiskBack size={18} weight="fill" />
              Adicionar fornecedor
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  )
}
