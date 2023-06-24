import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'

import { RVProductsProps } from '../../../@types/rv/products'
import { Button } from '../../../components/Form/Button'
import { Checkbox } from '../../../components/Form/Checkbox'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'
import { FormataValorMonetario } from '../../../functions/currency'
import { Container } from '../../../template/Container'

export default function NewProduct() {
  const formProduct = useForm<RVProductsProps>()
  const { handleSubmit, setValue } = formProduct

  const router = useNavigate()
  const location = useLocation()

  function handleUpdateProduct(data) {
    console.log(data)
  }

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
    }
  }, [location])

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
            <div className="flex gap-2">
              <Checkbox name="prrv_ativo" label="Ativo" />
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
