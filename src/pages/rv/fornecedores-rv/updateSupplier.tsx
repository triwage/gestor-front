import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Textarea } from '../../../components/Form/Textarea'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { useRVCategories } from '../../../services/rv/categories'
import { updateRVSupplier } from '../../../services/rv/providers'

import { RVProvidersProps } from '../../../@types/rv/providers'

import useLoading from '../../../contexts/LoadingContext'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import { CaretLeft, FloppyDiskBack, Images } from '@phosphor-icons/react'

export default function UpdateSupplier() {
  const formProduct = useForm<RVProvidersProps>()
  const { handleSubmit, setValue, control, watch } = formProduct

  const { setLoading } = useLoading()

  const { data: RVcategories } = useRVCategories()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateSupplier(data: RVProvidersProps) {
    // @ts-expect-error
    data.forv_pcrv_id = data.forv_kind.value
    // @ts-expect-error
    data.pcrv_kind = data.forv_kind.label
    // @ts-expect-error
    data.forv_kind = data.forv_kind.label

    setLoading(true)
    await updateRVSupplier(data)
    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageCloud = await uploadImages(res)
      setValue('forv_logo', imageCloud)
    }
    const inputElem = document.getElementById('newFile') as HTMLInputElement
    if (inputElem) {
      inputElem.value = ''
    }
  }

  const optionsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (RVcategories) {
      res = RVcategories?.map((item) => {
        return {
          value: item.pcrv_id,
          label: item.pcrv_kind,
        }
      })
    }
    return res
  }, [RVcategories])

  useEffect(() => {
    if (location.state) {
      const supplierEdit = Object.keys(location.state)

      supplierEdit?.forEach((supplier) => {
        // @ts-expect-error
        setValue(String(supplier), location.state[supplier])
      })
      if (optionsCategories) {
        setValue(
          // @ts-expect-error
          'forv_kind',
          optionsCategories?.find(
            (e) => e.value === location.state.forv_pcrv_id,
          ),
        )
      }
    }
  }, [location, optionsCategories])

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Fornecedores / Editar fornecedor</TextHeading>
          </div>
        </div>

        <FormProvider {...formProduct}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateSupplier)}
          >
            <div className="flex gap-2">
              <Input name="forv_provider" label="Nome" />
              <Select
                control={control}
                label="Categoria"
                name="forv_kind"
                options={optionsCategories}
              />
            </div>

            <div className="flex gap-2">
              <Textarea name="forv_descricao" label="Descrição" rows={8} />
              <Textarea
                name="forv_termos_condicoes"
                label="Termos e condições"
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Textarea name="forv_instrucoes" label="Instruções" rows={8} />

              <div className="flex h-full items-end gap-4">
                <img src={watch('forv_logo')} alt="Logo" />
                <div>
                  <label
                    htmlFor="newFile"
                    className="flex w-max cursor-pointer flex-col"
                  >
                    <div className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white">
                      <Images size={20} weight="fill" />
                      Alterar logo
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
              <Button onClick={() => handleSubmit(handleUpdateSupplier)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar fornecedor
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
