import Logo from '../../../assets/logo.png'

export function LeftBar() {
  return (
    <div className="relative flex items-center justify-center gap-2 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-2">
        <img src={Logo} alt="Logo da triwage" className="h-14 w-14" />
        <span className="font-semibold">Triwage</span>
      </div>

      <div className="absolute bottom-0 right-0 top-0 w-px bg-primary" />
    </div>
  )
}
