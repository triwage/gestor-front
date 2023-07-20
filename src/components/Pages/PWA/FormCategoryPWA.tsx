import { ChangeEvent, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { uploadImages } from '../../../services/images'
import { addPWACategories } from '../../../services/pwa/categories'
import { useRVCategories } from '../../../services/rv/categories'

import { PWACategoriesProps } from '../../../@types/pwa/categories'
import { SelectProps } from '../../../@types/select'

import useConfirm from '../../../contexts/ConfirmContext'
import useLoading from '../../../contexts/LoadingContext'
import { getBase64, handleUploadImage } from '../../../functions/general'
import { Button } from '../../Form/Button'
import { Input } from '../../Form/Input'
import { Select } from '../../Form/Select'
import { Switch } from '../../Form/Switch'
import { alerta } from '../../System/Alert'
import { Dialog } from '../../System/Dialog'
import { Icon } from '../../System/Icon'
import { Loader } from '../../System/Loader'
import { TextAction } from '../../Texts/TextAction'
import { FloppyDiskBack, Images, ImagesSquare } from '@phosphor-icons/react'

interface FormCategoryPWAProps {
  open: boolean
  closeDialog: () => void
  optionsCashback: SelectProps[]
  onSuccess: (res?: PWACategoriesProps | null) => void
}

interface Inputs extends PWACategoriesProps {
  providerRv: SelectProps | null
  cash: SelectProps | null
  categoryRv: SelectProps | null
  imagem_aux: File
}

export function FormCategoryPWA({
  open,
  closeDialog,
  optionsCashback,
  onSuccess,
}: FormCategoryPWAProps) {
  const formCategory = useForm<Inputs>()
  const { handleSubmit, setValue, watch, control } = formCategory

  const { data: CategoriesRV, isLoading, isFetching } = useRVCategories()

  const { setLoading } = useLoading()
  const { Confirm } = useConfirm()

  const optionsCategoriesRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>

    if (CategoriesRV) {
      res = CategoriesRV?.map((item) => {
        return {
          value: item.pcrv_id,
          label: item.pcrv_kind,
        }
      })
    }
    return res
  }, [CategoriesRV])

  async function getImageCategory(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)

    if (res) {
      const imageFinal = (await getBase64(res)) as string
      setValue('pcpw_imagem', imageFinal)
      setValue('imagem_aux', res)
    }
    const inputElem = document.getElementById(
      'newFileModal',
    ) as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  async function handleUpdateProductMax(data: Inputs) {
    setLoading(true)
    const imageAnexed = watch('imagem_aux')
    if (imageAnexed) {
      data.pcpw_imagem = await uploadImages(imageAnexed)
    } else {
      data.pcpw_imagem = watch('pcpw_imagem')
    }

    data.pcpw_cash_id = Number(data.cash?.value)
    data.pcpw_rv_id = Number(data.categoryRv?.value)

    const res = await addPWACategories(data)

    alerta('Categoria criada com sucesso', 1)
    setLoading(false)
    onSuccess(res)
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
      <FormProvider {...formCategory}>
        <form
          className="mb-2 flex w-full flex-col items-center gap-2 p-4 sm:min-w-[678px]"
          onSubmit={handleSubmit(handleUpdateProductMax)}
        >
          <TextAction className="mb-6 font-semibold">
            Cadastrar nova categoria
          </TextAction>
          <div className="flex w-full gap-2">
            <Input name="pcpw_descricao" label="Nome" />
            <Select
              control={control}
              label="Cashback"
              name="cash"
              options={optionsCashback}
            />
          </div>

          <div className="grid w-full grid-cols-2 items-center gap-2">
            <Select
              control={control}
              label="Categoria da RV"
              name="categoryRv"
              options={optionsCategoriesRV}
            />

            <Switch name="pcpw_ativo" label="Ativo" />
          </div>

          <div className="w-full">
            <div className="flex items-end gap-4">
              {!watch('pcpw_imagem') && (
                <Icon>
                  <ImagesSquare size={96} weight="fill" />
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
                  htmlFor="newFileModal"
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
                  id="newFileModal"
                  type="file"
                  accept="image/*"
                  onChange={getImageCategory}
                />
              </div>
            </div>
          </div>

          <div className="w-full border-t border-border pt-1">
            <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
              <FloppyDiskBack size={18} weight="fill" />
              Adicionar categoria
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  )
}
