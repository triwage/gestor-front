import { BannersProps } from '../../../@types/banners'
import { Button } from '../../Form/Button'
import { TextBody } from '../../Texts/TextBody'
import { TextHeading } from '../../Texts/TextHeading'

export function PreviewBanner({ img, subtitle, title }: BannersProps) {
  return (
    <div className="flex h-[151px] w-[375px] items-end justify-between rounded-xl bg-blue-200 px-1 shadow-md transition-all hover:drop-shadow-lg active:drop-shadow-lg dark:active:shadow-sm">
      <div className="ml-1 flex h-full w-full flex-1 flex-col items-start justify-between gap-1  py-1">
        <div className="mt-3 flex h-full flex-col items-start gap-1">
          <TextHeading
            size="xs"
            className="max-w-[200px] break-words font-semibold text-black"
          >
            {title}
          </TextHeading>
          <TextBody size="sm" className="text-gray">
            {subtitle}
          </TextBody>
        </div>
        <Button variant="primary">Convidar amigos</Button>
      </div>

      <img alt="Patrocinador" src={img} className="m-0 max-w-[200px]" />
    </div>
  )
}
