import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Select } from '../../../components/Form/Select'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { useRVCategories } from '../../../services/rv/categories'
import { updateRVProduct } from '../../../services/rv/products'

import { RVProductsProps } from '../../../@types/rv/products'

import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { Container } from '../../../template/Container'
import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'

export default function UpdateProduct() {
  const formProduct = useForm<RVProductsProps>()
  const { handleSubmit, setValue, control } = formProduct

  const { setLoading } = useLoading()

  const { data: RVcategories } = useRVCategories()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProduct(data: RVProductsProps) {
    // @ts-expect-error
    data.prrv_pcrv_id = data.pcrv_id.value

    setLoading(true)
    await updateRVProduct(data)
    setLoading(false)
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
    const checkTypeof = {
      prrv_valor: true,
      prrv_valor_minimo: true,
      prrv_valor_maximo: true,
    }
    if (location.state) {
      const userEdit = Object.keys(location.state)

      userEdit?.forEach((user) => {
        // @ts-expect-error
        if (checkTypeof[String(user)]) {
          setValue(
            // @ts-expect-error
            String(user),
            FormataValorMonetario(location.state[user], false),
          )
        } else {
          // @ts-expect-error
          setValue(String(user), location.state[user])
        }
      })
      if (optionsCategories) {
        setValue(
          // @ts-expect-error
          'pcrv_id',
          optionsCategories?.find(
            (e) => e.value === location.state.prrv_pcrv_id,
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
            <TextHeading>Produtos / Editar produto</TextHeading>
          </div>
        </div>

        <FormProvider {...formProduct}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateProduct)}
          >
            <div className="flex gap-2">
              <Input name="prrv_nome" label="Nome" />
              <Input name="forv_provider" label="Fornecedor" disabled />
            </div>

            <div className="flex gap-2">
              <InputCurrency name="prrv_valor" label="Valor" />
              <InputCurrency name="prrv_valor_minimo" label="Valor mínimo" />
              <InputCurrency name="prrv_valor_maximo" label="Valor máximo" />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Select
                control={control}
                label="Categoria"
                name="pcrv_id"
                options={optionsCategories}
              />
              <Checkbox name="prrv_ativo" label="Produto ativo" />
            </div>
            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleUpdateProduct)}>
                <FloppyDiskBack size={18} weight="fill" />
                Atualizar produto
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
