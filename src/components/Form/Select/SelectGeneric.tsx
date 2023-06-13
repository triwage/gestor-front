import { InputHTMLAttributes, ReactNode } from 'react'
import Select from 'react-select'

import clsx from 'clsx'

const colourStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    height: '2.75rem',
  }),
  option: (
    styles: Record<string, any>,
    { isDisabled, isFocused, isSelected }: any,
  ) => {
    const color = '#a2c2f6'
    const selected = '#73a4f2'
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? selected
        : isFocused
        ? color
        : undefined,
      color: isDisabled ? '#000' : isSelected,
      cursor: isDisabled ? 'not-allowed' : 'default',
      zIndex: '999',
      ':active': {
        ...styles[':active'],
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
    <>
      <label
        htmlFor={String(label)}
        className="md-max:uppercase -mb-0.5 w-full text-base font-medium text-black"
      >
        {label}
      </label>

      <Select
        instanceId={Math.floor(Math.random() * 9999)}
        className={clsx(
          'md-max:uppercase w-full',
          {
            'text-base font-medium': !className,
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
    </>
  )
}
