import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import { Icon } from '../../../components/System/Icon'
import { Loader } from '../../../components/System/Loader'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { ListDefaultOperationsCategories } from '../../../services/pwa/categories'
import { updateRVCategories } from '../../../services/rv/categories'

import { RVCategoriesProps } from '../../../@types/rv/categories'
import { SelectProps } from '../../../@types/select'

import useLoading from '../../../contexts/LoadingContext'
import { Container } from '../../../template/Container'
import { yupResolver } from '@hookform/resolvers/yup'
import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import * as yup from 'yup'

interface Inputs extends RVCategoriesProps {
  categoria_operacao: SelectProps | null
}

const schemaCategory = yup
  .object({
    pcrv_kind: yup.string().required('Informe o nome'),
    categoria_operacao: yup.object().required('Selecione uma categoria padrão'),
  })
  .required()

export default function UpdateCategoryRV() {
  const formCategory = useForm<Inputs>({
    // @ts-expect-error
    resolver: yupResolver(schemaCategory),
  })
  const { handleSubmit, setValue, control } = formCategory

  const router = useNavigate()
  const location = useLocation()

  const { setLoading } = useLoading()

  const {
    data: DefaultOperationsCategories,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['PWADefaultOperationsCategories'],
    queryFn: ListDefaultOperationsCategories,
  })

  const optionsDefaultOperationsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (DefaultOperationsCategories) {
      res = DefaultOperationsCategories?.debito?.map((item, index) => {
        return {
          value: index,
          label: item,
        }
      })
    }
    return res
  }, [DefaultOperationsCategories])

  async function handleUpdateCategorieRV(data: Inputs) {
    setLoading(true)

    data.pcrv_categoria_operacao = data.categoria_operacao?.label || ''

    const res = await updateRVCategories(data)

    if (res) {
      setTimeout(() => {
        router('/rv/categorias-rv')
      }, 400)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (location.state) {
      const categoryEdit = Object.keys(location.state)

      categoryEdit?.forEach((categoryItem) => {
        // @ts-expect-error
        setValue(String(categoryItem), location.state[categoryItem])
      })

      setValue(
        'categoria_operacao',
        optionsDefaultOperationsCategories?.find(
          (e) => e.label === location.state.pcrv_categoria_operacao,
        ) ?? null,
      )
    }
  }, [location, optionsDefaultOperationsCategories])

  return (
    <Container>
      {(isLoading || isFetching) && <Loader />}
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Categorias RV / Editar categoria</TextHeading>
          </div>
        </div>

        <FormProvider {...formCategory}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateCategorieRV)}
          >
            <div className="flex">
              <Input name="pcrv_id" label="ID" disabled />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Input name="pcrv_kind" label="Nome" />

              <Select
                control={control}
                label="Categoria padrão"
                name="categoria_operacao"
                options={optionsDefaultOperationsCategories}
              />
            </div>

            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleUpdateCategorieRV)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar categoria
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
