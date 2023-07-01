import { ChangeEvent, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { uploadImages } from '../../../services/images'
import { usePWACashback } from '../../../services/pwa/cashback'
import {
  addPWACategories,
  updatePWACategory,
} from '../../../services/pwa/categories'
import { useRVProducts } from '../../../services/rv/products'

import { PWACategoriesProps } from '../../../@types/pwa/categories'

import useLoading from '../../../contexts/LoadingContext'
import { handleUploadImage } from '../../../functions/general'
import { Container } from '../../../template/Container'
import {
  CaretLeft,
  FloppyDiskBack,
  Images,
  UserSquare,
} from '@phosphor-icons/react'

export default function UpdateCategoryPWA() {
  const formCategory = useForm<PWACategoriesProps>()
  const { handleSubmit, setValue, watch, control } = formCategory

  const { data: ProductsRV, isLoading, isFetching } = useRVProducts()
  const {
    data: CashbackPWA,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWACashback()

  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProductMax(data: PWACategoriesProps) {
    setLoading(true)
    // @ts-expect-error
    data.pcpw_cash_id = data.pcpw_cash_id.value
    // @ts-expect-error
    data.pcpw_prrv_id = data.pcpw_prrv_id.value

    if (location.state) {
      await updatePWACategory(data)
    } else {
      await addPWACategories(data)
    }
    setLoading(false)
  }

  async function getImage(event: ChangeEvent<HTMLInputElement>) {
    const res = await handleUploadImage(event)
    if (res) {
      const imageCloud = await uploadImages(res)
      setValue('pcpw_imagem', imageCloud)
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
      const categoryEdit = Object.keys(location.state)

      categoryEdit?.forEach((user) => {
        // @ts-expect-error
        setValue(String(user), location.state[user])
      })
      if (optionsCashback) {
        setValue(
          'pcpw_cash_id',
          // @ts-expect-error
          optionsCashback?.find((e) => e.value === location.state.pcpw_cash_id),
        )
      }
      if (optionsProductsRV) {
        setValue(
          'pcpw_prrv_id',
          // @ts-expect-error
          optionsProductsRV?.find(
            (e) => e.value === location.state.pcpw_prrv_id,
          ),
        )
      }
    }
  }, [location])

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
                ? 'Categorias PWA / Editar categoria'
                : 'Categorias PWA / Adicionar categoria'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formCategory}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateProductMax)}
          >
            <div className="flex gap-2">
              <Input name="pcpw_descricao" label="Nome" />
              <Select
                control={control}
                label="Cashback"
                name="pcpw_cash_id"
                options={optionsCashback}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <Select
                control={control}
                label="Produto RV"
                name="pcpw_prrv_id"
                options={optionsProductsRV}
              />
              <Checkbox name="pcpw_ativo" label="Ativo" />
            </div>
            <div className="flex gap-2">
              <div className="flex items-end gap-4">
                {!watch('pcpw_imagem') && (
                  <Icon>
                    <UserSquare size={96} weight="fill" />
                  </Icon>
                )}

                {watch('pcpw_imagem') && (
                  <img
                    src={watch('pcpw_imagem')}
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
              <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                <FloppyDiskBack size={18} weight="fill" />
                {location.state ? 'Atualizar categoria' : 'Adicionar categoria'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
