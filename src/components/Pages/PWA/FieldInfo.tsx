import { TextAction } from '../../Texts/TextAction'
import { TextBody } from '../../Texts/TextBody'
import clsx from 'clsx'

interface FieldInfoProps {
  title: string
  description: string | number
  className?: string
  classNameTitle?: string
}

export function FieldInfo({
  title,
  description,
  className,
  classNameTitle,
}: FieldInfoProps) {
  return (
    <div className="flex w-full flex-col">
      <TextAction
        className={`${classNameTitle} font-semibold text-black dark:text-white sm:text-base`}
      >
        {title}
      </TextAction>
      <TextBody
        className={clsx(
          'w-full rounded-md p-2 font-semibold',
          {
            'border border-border text-black dark:text-white': !className,
          },
          className,
        )}
      >
        {description}
      </TextBody>
    </div>
  )
}
