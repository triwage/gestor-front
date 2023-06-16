import { useMemo, useRef, useState } from 'react'
import Calendar from 'react-calendar'

import { CalendarBlank, X } from '@phosphor-icons/react'
import { format, parse } from 'date-fns'
import 'react-calendar/dist/Calendar.css'
import { mask, unMask } from 'remask'

interface DateProps {
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
}: DateProps) {
  const [valueCalendar, setValueCalendar] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleDates(date: any) {
    onChange(date)
    setOpen(false)
    setValueCalendar(date)
    const dateFormat = format(date, 'dd/MM/yyyy')
    if (inputRef !== null) {
      ;(inputRef.current as HTMLInputElement).value = dateFormat
    }
  }

  function handleInputDate(e: any) {
    const date = parse(e.target.value, 'dd/MM/yyyy', new Date())
    if (e.target.value.length === 10) {
      if (date instanceof Date && !isNaN(date.valueOf())) {
        setValueCalendar(date)
        onChange(date)
      }
    }
    const result = mask(unMask(e.target.value), ['99/99/9999'])
    e.target.value = result
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
        className="border-border-form flex h-10 w-full select-none items-center rounded-md border border-gray-300/30 bg-gray/20 pl-2
          transition-all focus-within:border focus-within:border-gray"
      >
        <CalendarBlank
          size={20}
          className="text-primary dark:text-white"
          weight="fill"
          onClick={() => {
            !disabled && setOpen(true)
          }}
        />
        <input
          type="text"
          className="flex h-10 w-full flex-1 appearance-none rounded-md border-none bg-transparent px-2 text-sm font-medium text-black outline-none placeholder:font-normal dark:text-white"
          defaultValue={format(new Date(valueCalendar), 'dd/MM/yyyy')}
          disabled={disabled}
          onChange={handleInputDate}
          ref={inputRef}
        />
      </div>

      {open && (
        <div className="fixed left-0 top-0 z-[999] flex h-screen w-screen flex-col items-center justify-center bg-opacity">
          <div className="flex flex-col items-end justify-center space-y-0.5">
            <div className="z-50 flex items-center justify-center rounded-full p-1">
              <X
                size={28}
                weight="bold"
                className="cursor-pointer text-white"
                onClick={() => {
                  setOpen(false)
                }}
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
