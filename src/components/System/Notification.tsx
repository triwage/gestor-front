interface NotificationProps {
  description: any
}

export function Notification({ description }: NotificationProps) {
  return (
    <div className="flex h-full w-full flex-1 flex-col flex-wrap items-start justify-center">
      {description &&
      Object.keys(description).length > 1 &&
      typeof description !== 'string' ? (
        description.map((item: any) => (
          <span className="w-full text-base font-semibold" key={item}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </span>
        ))
      ) : (
        <span className="w-full text-base font-semibold">{description}</span>
      )}
    </div>
  )
}
