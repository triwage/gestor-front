import { BannersProps } from '../../../@types/pwa/banners'

import { Button } from '../../Form/Button'
import { TextBody } from '../../Texts/TextBody'
import { TextHeading } from '../../Texts/TextHeading'

export function PreviewBanner({
  geba_imagem,
  geba_subtitulo,
  geba_titulo,
  geba_botao_texto,
}: BannersProps) {
  return (
    <div className="flex h-[151px] w-[375px] items-end justify-between rounded-xl bg-blue-200 px-1 shadow-md transition-all hover:drop-shadow-lg active:drop-shadow-lg dark:active:shadow-sm">
      <div className="ml-1 flex h-full w-full flex-1 flex-col items-start justify-between gap-1  py-1">
        <div className="mt-3 flex h-full flex-col items-start gap-1">
          <TextHeading
            size="xs"
            className="max-w-[200px] break-words font-semibold text-black"
          >
            {geba_titulo}
          </TextHeading>
          <TextBody size="sm" className="text-gray">
            {geba_subtitulo}
          </TextBody>
        </div>
        <Button className="max-w-[200px]" variant="primary">
          {geba_botao_texto}
        </Button>
      </div>

      {geba_imagem && (
        <img
          alt="Patrocinador"
          src={geba_imagem}
          className="m-0 max-w-[200px]"
        />
      )}
    </div>
  )
}
