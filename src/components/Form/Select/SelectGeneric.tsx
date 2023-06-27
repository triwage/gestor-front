import { InputHTMLAttributes, ReactNode } from 'react'
import Select from 'react-select'

import clsx from 'clsx'

const colourStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'rgb(122 122 122 / 0.2)',
    color: '#fff',
    height: '2.75rem',
    border: '1px solid rgb(214 215 219 / 0.3)',
  }),
  option: (
    styles: Record<string, any>,
    { isDisabled, isFocused, isSelected }: any,
  ) => {
    const color = '#fff'
    const selected = '#145dd2'
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? selected
        : isFocused
        ? color
        : undefined,
      color: isSelected ? '#fff' : isDisabled ? '#000' : isSelected,
      cursor: isDisabled ? 'not-allowed' : 'default',
      zIndex: '999',
      ':active': {
        ...styles[':active'],
        color: '#fff',
        backgroundColor: !isDisabled
          ? isSelected
            ? selected
            : color
          : undefined,
      },
    }
  },
  input: (styles: any) => ({ ...styles }),
  placeholder: (styles: any) => ({ ...styles }),
}

interface SelectGenericProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string | ReactNode
  onChange: any
  options: any[]
  inputRef?: any
}

export function SelectGeneric({
  label,
  options,
  onChange,
  className,
  ...props
}: SelectGenericProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-0.5">
      <label
        htmlFor={String(label)}
        className="-mb-0.5 w-full text-sm font-medium text-black dark:text-white"
      >
        {label}
      </label>

      <Select
        instanceId={Math.floor(Math.random() * 9999)}
        className={clsx(
          ' w-full',
          {
            'text-base font-medium text-black': !className,
          },
          className,
        )}
        {...props}
        id={String(label)}
        placeholder={props.placeholder ?? label}
        onChange={onChange}
        options={options}
        styles={colourStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#0F48A3',
          },
        })}
      />
    </div>
  )
}
