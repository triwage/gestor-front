import { ChangeEvent, useMemo, useRef, useState } from 'react'
import Calendar from 'react-calendar'

import { CalendarBlank, X } from '@phosphor-icons/react'
import { format, parse } from 'date-fns'
import 'react-calendar/dist/Calendar.css'

interface InputCalendarProps {
  name: string
  label?: string
  value: Date
  onChange: any
  minDate?: any
  maxDate?: any
  disabled?: any
}

export function InputCalendar({
  onChange,
  value,
  label,
  minDate,
  maxDate,
  disabled,
  ...props
}: InputCalendarProps) {
  const [valueCalendar, setValueCalendar] = useState(new Date())
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleDates(date: any) {
    onChange(date)
    setOpen(false)
    setValueCalendar(date)
    const dateFormat = format(date, 'dd/MM/yyyy')
    if (inputRef !== null) {
      ;(inputRef.current as unknown as HTMLInputElement).value = dateFormat
    }
  }

  function handleInputDate(e: ChangeEvent<HTMLInputElement>) {
    const date = parse(e.target.value, 'dd/MM/yyyy', new Date())
    if (e.target.value.length === 10) {
      if (date instanceof Date && !isNaN(date.valueOf())) {
        setValueCalendar(date)
        onChange(date)
      }
    }
    e.currentTarget.maxLength = 8
    let result = e.currentTarget.value
    const tst = result.replace(/\D/g, '')
    result = tst.replace(/^(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')

    e.currentTarget.value = result
  }

  useMemo(() => {
    if (value) {
      let date = value
      if (typeof date === 'string') {
        date = parse(String(value), 'dd/MM/yyyy', new Date())
      }
      setValueCalendar(date)
      const dateFormat = format(date, 'dd/MM/yyyy')
      if (inputRef?.current !== null) {
        ;(inputRef?.current).value = dateFormat
      }
      onChange(dateFormat)
    }
  }, [value])

  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <label
        htmlFor="small"
        className="text-sm font-medium text-black dark:text-white"
      >
        {label}
      </label>
      <div
        className="gap-q flex h-9 w-full select-none items-center rounded-md border border-gray-300/30 bg-gray/20 p-2
          transition-all focus-within:border-2 focus-within:border-primary"
      >
        <CalendarBlank
          size={24}
          className="text-primary dark:text-white"
          weight="fill"
          onClick={() => {
            !disabled && setOpen(true)
          }}
        />
        <input
          type="text"
          className="flex h-max w-full appearance-none rounded-md border-none bg-transparent p-2 text-sm font-medium leading-4 text-black outline-none placeholder:font-normal dark:text-white"
          defaultValue={format(new Date(valueCalendar), 'dd/MM/yyyy')}
          disabled={disabled}
          onChange={handleInputDate}
          ref={inputRef}
        />
      </div>

      {open && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-opacity">
          <div className="flex flex-col items-end justify-center gap-0.5">
            <div
              onClick={() => {
                setOpen(false)
              }}
              className="flex items-center justify-center rounded-full p-1"
            >
              <X
                size={24}
                weight="bold"
                className="cursor-pointer text-primary"
              />
            </div>
            <Calendar
              {...props}
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleDates}
              value={valueCalendar}
              locale="pt-BR"
            />
          </div>
        </div>
      )}
    </div>
  )
}
