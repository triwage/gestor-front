import { useNavigate } from 'react-router'

import { Icon } from '../../../components/System/Icon'
import { TextHeading } from '../../../components/Texts/TextHeading'

import { Container } from '../../../template/Container'
import { CaretLeft } from '@phosphor-icons/react'

export default function AddProduct() {
  const router = useNavigate()

  return (
    <Container>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <Icon onClick={() => router(-1)}>
              <CaretLeft size={22} className="text-black dark:text-white" />
            </Icon>
            <TextHeading>Produtos PWA / Adicionar produto</TextHeading>
          </div>
        </div>
      </div>
    </Container>
  )
}
