import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '../../../components/Form/Button'
import { Input } from '../../../components/Form/Input'
import { InputCurrency } from '../../../components/Form/InputCurrency'
import { Switch } from '../../../components/Form/Switch'
import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import {
  addPWACashback,
  updatePWACashback,
} from '../../../services/pwa/cashback'

import { PWACashbackProps } from '../../../@types/pwa/cashback'

import useLoading from '../../../contexts/LoadingContext'
import { FormataValorMonetario } from '../../../functions/currency'
import { Container } from '../../../template/Container'
import { CaretLeft, FloppyDiskBack } from '@phosphor-icons/react'

export default function UpdateCategoryPWA() {
  const formCashback = useForm<PWACashbackProps>()
  const { handleSubmit, setValue } = formCashback

  const { setLoading } = useLoading()

  const router = useNavigate()
  const location = useLocation()

  async function handleUpdateProductMax(data: PWACashbackProps) {
    setLoading(true)
    if (location.state) {
      await updatePWACashback(data)
    } else {
      await addPWACashback(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const checkTypeof = {
      cash_valor: true,
    }
    if (location.state) {
      const cashBackEdit = Object.keys(location.state)

      cashBackEdit?.forEach((cashItem) => {
        // @ts-expect-error
        if (checkTypeof[String(cashItem)]) {
          setValue(
            // @ts-expect-error
            String(cashItem),
            FormataValorMonetario(location.state[cashItem], false),
          )
        } else {
          // @ts-expect-error
          setValue(String(cashItem), location.state[cashItem])
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
            <TextHeading>
              {location.state
                ? 'Cashback PWA / Editar cashback'
                : 'Cashback PWA / Adicionar cashback'}
            </TextHeading>
          </div>
        </div>

        <FormProvider {...formCashback}>
          <form
            className="my-2 space-y-2"
            onSubmit={handleSubmit(handleUpdateProductMax)}
          >
            <div className="flex gap-2">
              <Input name="cash_descricao" label="Nome" />
              <InputCurrency name="cash_valor" label="Valor" />
            </div>

            <div className="flex gap-2">
              <Switch name="cash_ativo" label="Ativo" />
            </div>

            <div className="w-full border-t border-border pt-1">
              <Button onClick={() => handleSubmit(handleUpdateProductMax)}>
                <FloppyDiskBack size={18} weight="fill" />
                {location.state ? 'Atualizar cashback' : 'Adicionar cashback'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}
