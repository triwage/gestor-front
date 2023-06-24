import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@/assets/logo.png'
import { Sun, Moon, SignOut, CaretDown } from '@phosphor-icons/react'
import clsx from 'clsx'

import { MenusProps } from '../@types/menus'
import { useMenus } from '../services/menus'
import { Menu } from './Menu'
import { Icon } from './System/Icon'
import { Loader } from './System/Loader'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState<number | boolean>(false)
  const [menus, setMenus] = useState<MenusProps[] | null>(null)
  const [theme, setTheme] = useState<null | string>(null)
  const router = useNavigate()

  const { data, isLoading, isFetching } = useMenus()

  function handleExpandir(menu: MenusProps) {
    const itensExpandirAux = isOpen !== menu.gemeId ? menu.gemeId : -1

    setIsOpen(itensExpandirAux)
  }

  function handleClickMenuPai(menu: MenusProps) {
    if (menu.gemeUrl && menu.gemeUrl !== '#') {
      router(`/${menu.gemeUrl}`)
    }
  }

  function subMenus(menu: MenusProps, itensExpandir: boolean | number) {
    if (menu?.ITENS.length > 0) {
      return (
        <Menu
          menu={menu}
          show={itensExpandir}
          onClick={(value) => {
            setIsOpen(true)
            handleExpandir(value)
            handleClickMenuPai(value)
          }}
        />
      )
    }
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

  useEffect(() => {
    if (data) {
      const res = [] as MenusProps[]
      data?.forEach((item: MenusProps) => {
        if (!item.gemeGemeId) {
          item.ITENS = []
          res.push(item)
        }
      })

      for (let indexDad = 0; indexDad < res.length; indexDad++) {
        for (let element = 0; element < data.length; element++) {
          if (data[element].gemeGemeId === res[indexDad].gemeId) {
            res[indexDad].ITENS.push(data[element])
          }
        }
      }
      setMenus(res)
    }
  }, [data, isLoading, isFetching])

  if (isLoading || isFetching) {
    return <Loader />
  }

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
              {menus?.map((element) => (
                <Fragment key={element.gemeDescricao}>
                  <div
                    onClick={() => {
                      setIsOpen(true)
                      handleExpandir(element)
                      handleClickMenuPai(element)
                    }}
                    className={clsx(
                      'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
                      {
                        'border-b border-white-200/70':
                          isOpen === element.gemeId && element.ITENS.length > 0,
                        'justify-start': isOpen,
                        'justify-center': !isOpen,
                        ' bg-primary/20 dark:bg-black/40':
                          location.pathname === element.gemeUrl,
                      },
                    )}
                  >
                    <div
                      className={clsx('flex w-full items-center  text-center', {
                        'justify-between': isOpen,
                        'justify-center': !isOpen,
                      })}
                    >
                      <div className="flex items-center gap-2 text-center">
                        <img
                          src={element.gemeIcone}
                          className="h-5 w-5"
                          alt={element.gemeDescricao}
                        />
                        <span
                          className={clsx(
                            'select-none text-sm font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
                            {
                              'invisible hidden': !isOpen,
                            },
                          )}
                        >
                          {element.gemeDescricao}
                        </span>
                      </div>
                      {isOpen && element.ITENS.length > 0 && (
                        <Icon>
                          <CaretDown size={20} className="text-white" />
                        </Icon>
                      )}
                    </div>
                  </div>
                  {subMenus(element, Number(isOpen))}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-2">
            {theme === 'dark' && (
              <div
                onClick={toggleTheme}
                className={clsx(
                  'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
                  {
                    'justify-start': isOpen,
                    'justify-center': !isOpen,
                  },
                )}
              >
                <div
                  className={clsx('flex w-full items-center  text-center', {
                    'justify-between': isOpen,
                    'justify-center': !isOpen,
                  })}
                >
                  <div className="flex items-center gap-2 text-center">
                    <Icon>
                      <Moon
                        size={20}
                        className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                        weight="fill"
                      />
                    </Icon>
                    <span
                      className={clsx(
                        'select-none text-sm font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
                        {
                          'invisible hidden': !isOpen,
                        },
                      )}
                    >
                      Dark
                    </span>
                  </div>
                </div>
              </div>
            )}
            {theme === 'light' && (
              <div
                onClick={toggleTheme}
                className={clsx(
                  'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
                  {
                    'justify-start': isOpen,
                    'justify-center': !isOpen,
                  },
                )}
              >
                <div
                  className={clsx('flex w-full items-center  text-center', {
                    'justify-between': isOpen,
                    'justify-center': !isOpen,
                  })}
                >
                  <div className="flex items-center gap-2 text-center">
                    <Icon>
                      <Sun
                        size={20}
                        className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                      />
                    </Icon>
                    <span
                      className={clsx(
                        'select-none text-sm font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
                        {
                          'invisible hidden': !isOpen,
                        },
                      )}
                    >
                      Light
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              onClick={() => console.log('888')}
              className={clsx(
                'group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-primary/20 dark:hover:bg-black/40',
                {
                  'justify-start': isOpen,
                  'justify-center': !isOpen,
                },
              )}
            >
              <div
                className={clsx('flex w-full items-center  text-center', {
                  'justify-between': isOpen,
                  'justify-center': !isOpen,
                })}
              >
                <div className="flex items-center gap-2 text-center">
                  <Icon>
                    <SignOut
                      size={20}
                      className="text-primary/80 group-hover:text-primary dark:text-white/80 dark:group-hover:text-white"
                    />
                  </Icon>
                  <span
                    className={clsx(
                      'select-none text-sm font-medium text-primary/90 transition-all group-hover:text-primary dark:text-white/90 dark:group-hover:text-white',
                      {
                        'invisible hidden': !isOpen,
                      },
                    )}
                  >
                    Sair
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
