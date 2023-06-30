import { Icon } from './Icon'
import {
  HouseSimple,
  DeviceMobile,
  Broadcast,
  Gear,
  Package,
  Armchair,
  Cpu,
  NoteBlank,
  Faders,
  Users,
} from '@phosphor-icons/react'

interface IconsMenuProps {
  name:
    | 'Home'
    | 'PWA'
    | 'Auxiliares'
    | 'Configurações'
    | 'Produtos'
    | 'Categorias'
    | 'Fornecedores'
    | 'Parâmetros'
    | 'Usuários'
    | 'Banners'
    | 'Produtos RV'
    | 'Categorias RV'
    | 'Fornecedores RV'
    | 'Produtos Max Nivel'
}

export function IconsMenu({ name }: IconsMenuProps) {
  function IconReturn() {
    const IconsReturn = {
      Home: <HouseSimple size={20} className="text-primary dark:text-white" />,
      PWA: <DeviceMobile size={20} className="text-primary dark:text-white" />,
      Auxiliares: (
        <Broadcast size={20} className="text-primary dark:text-white" />
      ),
      Configurações: (
        <Gear size={20} className="text-primary dark:text-white" />
      ),
      Produtos: <Package size={20} className="text-primary dark:text-white" />,
      Categorias: (
        <Armchair size={20} className="text-primary dark:text-white" />
      ),
      Fornecedores: <Cpu size={20} className="text-primary dark:text-white" />,
      Parâmetros: <Faders size={20} className="text-primary dark:text-white" />,
      Usuários: <Users size={20} className="text-primary dark:text-white" />,
      Banners: <NoteBlank size={20} className="text-primary dark:text-white" />,
      'Produtos RV': (
        <Package size={20} className="text-primary dark:text-white" />
      ),
      'Categorias RV': (
        <Armchair size={20} className="text-primary dark:text-white" />
      ),
      'Fornecedores RV': (
        <Cpu size={20} className="text-primary dark:text-white" />
      ),
      'Produtos Max Nivel': (
        <Package size={20} className="text-primary dark:text-white" />
      ),
    }

    return IconsReturn[name] ?? null
  }

  return <>{IconReturn() && <Icon>{IconReturn()}</Icon>}</>
}
