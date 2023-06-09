import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/assets/logo.png'
import { HouseSimple, Sun, Moon, SignOut, Package } from '@phosphor-icons/react'
import clsx from 'clsx'

import { Menu } from './Menu'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<null | string>(null)
  const router = useNavigate()

  function navigateToPageMenu(value: string) {
    router(value)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    const themeLocal = localStorage.getItem('theme')
    if (themeLocal === 'dark') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="fixed left-[230px] h-screen w-screen transition-all"
        />
      )}

      <div
        // onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'h-screen max-h-screen w-full border-r-[0.5px] border-primary bg-white transition-all dark:border-0 dark:bg-primary',
          {
            'max-w-[230px]': isOpen,
            'max-w-[60px]': !isOpen,
          },
        )}
      >
        <div className="flex h-full w-full flex-col items-start justify-between px-2 py-3">
          <div className="flex w-full flex-col gap-7">
            <img
              onClick={() => setIsOpen(!isOpen)}
              src={Logo}
              alt="logo"
              width={32}
              height={32}
              className="ml-2"
            />

            <div className="flex w-full flex-col items-start justify-start gap-2">
              <Menu
                onClick={() => navigateToPageMenu('/')}
                route="/"
                isOpen={isOpen}
                icon={
                  <HouseSimple
                    size={22}
                    className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                  />
                }
                name="Página inicial"
              />

              <Menu
                onClick={() => navigateToPageMenu('/products')}
                route="/products"
                isOpen={isOpen}
                icon={
                  <Package
                    size={22}
                    className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                  />
                }
                name="Produtos"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-2">
            {theme === 'dark' && (
              <Menu
                onClick={toggleTheme}
                isOpen={isOpen}
                icon={
                  <Sun
                    size={22}
                    className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                  />
                }
                name="Light"
              />
            )}
            {theme === 'light' && (
              <Menu
                onClick={toggleTheme}
                isOpen={isOpen}
                icon={
                  <Moon
                    size={22}
                    className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                    weight="fill"
                  />
                }
                name="Dark"
              />
            )}
            <Menu
              onClick={() => console.log('888')}
              isOpen={isOpen}
              icon={
                <SignOut
                  size={22}
                  className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                />
              }
              name="Sair"
            />
          </div>
        </div>
      </div>
    </>
  )
}
