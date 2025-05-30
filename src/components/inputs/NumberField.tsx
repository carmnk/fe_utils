import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  Ref,
  useRef,
} from 'react'
import { CTextField, CTextFieldProps } from './TextField'

const formatGermanNumberString = (
  number: number,
  digits?: number,
  disableNumberSeparator?: boolean,
  minDigits?: number
) => {
  return new Intl.NumberFormat('en-uk', {
    minimumFractionDigits: minDigits ?? 0,
    maximumFractionDigits: digits || undefined,
  })
    .format(number)
    ?.replaceAll(disableNumberSeparator ? ',' : '', '')
}

export type CNumberFieldProps = Omit<CTextFieldProps, 'value'> & {
  value?: number | '' | null
  isInt?: boolean
  // disableNumberSeparator?: boolean
  maxDecimalDigits?: number
  onChange?: (newValue: number, e: ChangeEvent<HTMLInputElement>) => void
  ref?: Ref<HTMLInputElement>
}

export const NumberField = (props: CNumberFieldProps) => {
  const {
    value,
    label,
    name,
    onChange,
    required,
    disableLabel,
    error,
    injectComponent,
    onChangeCompleted,
    maxLength,
    defaultValue,

    isInt,
    maxDecimalDigits = 3,
    slotProps,
    ref,
    ...rest
  } = props

  const disableNumberSeparator = true

  const [innerValue, setInnerValue] = useState<string | undefined>(
    defaultValue?.toString() as string
  )
  const defaultValueSet = useRef(false)
  const [valueStarted, setValueStarted] = useState(defaultValue ?? '')

  useEffect(() => {
    const isLastCharComma = innerValue?.slice?.(-1) === '.'
    const innerValueString = (
      isLastCharComma ? innerValue.slice(0, -1) : innerValue
    )?.replaceAll(',', '')
    // ?.replaceAll('.', '.')
    const innerValueNumber = innerValueString
      ? parseFloat(innerValueString)
      : null
    if (innerValue && innerValueNumber !== value) {
      setInnerValue(
        (value || value === 0) && !isNaN(value)
          ? formatGermanNumberString(
              value,
              typeof maxDecimalDigits === 'number' && maxDecimalDigits > 3
                ? maxDecimalDigits
                : undefined,
              disableNumberSeparator
            )
          : !defaultValueSet.current
            ? (defaultValue as string)
            : ''
      )
      defaultValueSet.current = true
    }

    if (innerValue === undefined && value !== defaultValue && value !== '') {
      setInnerValue(
        (value || value === 0) && !isNaN(value)
          ? formatGermanNumberString(
              value,
              typeof maxDecimalDigits === 'number' && maxDecimalDigits > 3
                ? maxDecimalDigits
                : undefined
            )
          : !defaultValueSet
            ? (defaultValue as string)
            : ''
      )
      defaultValueSet.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChangeCompleted = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const valueAdjIn = e?.target?.value
      const regexOnlyNumbers = /^[0-9.,]*$/
      const valueAdj = valueAdjIn.match(regexOnlyNumbers)
        ? parseFloat(valueAdjIn)
        : valueAdjIn
      // console.log(
      //   'handleChangeCompleted',
      //   e?.target?.value,
      //   value,
      //   innerValue,
      //   '-> ',
      //   valueAdj
      // )
      //dont trigger if value has not changed
      if (
        typeof valueAdj === 'undefined' ||
        valueAdj === null ||
        valueAdj.toString() === valueStarted
      )
        return
      onChangeCompleted?.(valueAdj as string, e, name)
    },
    [onChangeCompleted, valueStarted, name]
  )

  const handleChangeStarted = useCallback(() => {
    if (!value) return
    setValueStarted?.(value?.toString?.())
  }, [value])

  const handleChangeNumber = useCallback(
    (
      newValue: string,
      e?: ChangeEvent<HTMLInputElement>
      // nameIn?: string
    ) => {
      // const { name, value: valueIn } = e.target
      let valueInAdj = newValue.replaceAll(',', '')
      let isNumeric = true
      for (let i = 0; i < valueInAdj?.length || 0; i++) {
        const allowedPureNumberChars = [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
        ]
        const allowedDecimalChars = [...allowedPureNumberChars, '.']
        const allowedChars = isInt
          ? allowedPureNumberChars
          : allowedDecimalChars
        if (!allowedChars?.includes(valueInAdj?.substring(i, i + 1)))
          isNumeric = false
      }
      if (!isNumeric) return
      const amtCommas = valueInAdj?.match(/,/g)
      if ((amtCommas?.length || 0) > 1) return

      const posComma = valueInAdj.lastIndexOf('.')
      if (posComma !== -1) {
        if (posComma < valueInAdj.length - 1 - maxDecimalDigits) {
          valueInAdj = valueInAdj.slice(0, posComma + 1 + maxDecimalDigits)
        }
      }

      if (!valueInAdj) {
        onChange?.(
          '' as string,
          {
            ...e,
            target: {
              ...(e?.target ?? {}),
              value: '',
              name: name as string,
            },
          } as ChangeEvent<HTMLInputElement>,
          name
        )
        setInnerValue('')
      } else {
        const posComma = valueInAdj.indexOf('.')
        const checkString =
          posComma !== -1 ? valueInAdj.slice(0, posComma) : valueInAdj
        if (
          typeof maxLength === 'number' &&
          maxLength > 0 &&
          checkString?.length > maxLength &&
          isInt
        ) {
          return
        }
        const value = parseFloat(valueInAdj?.replaceAll('.', '.'))
        const charsAfterComma = valueInAdj.slice(posComma + 1)

        const isLastCharComma = valueInAdj.slice(-1) === '.'
        const newInnerValueRaw = isLastCharComma
          ? valueInAdj.slice(0, -1)
          : valueInAdj
        const newInnerValueNumber = parseFloat(
          newInnerValueRaw //?.replaceAll(',', '.')
        )
        const newInnerValue =
          formatGermanNumberString(
            newInnerValueNumber || 0,
            typeof maxDecimalDigits === 'number' && maxDecimalDigits > 3
              ? maxDecimalDigits
              : undefined,
            disableNumberSeparator,
            posComma !== -1 && charsAfterComma?.length
              ? Math.min(charsAfterComma?.length, maxDecimalDigits)
              : undefined
          ) + (isLastCharComma ? '.' : '')
        setInnerValue(newInnerValue)
        onChange?.(
          value as unknown as string,
          {
            ...e,
            target: {
              ...(e?.target ?? {}),
              value: value as unknown as string,
              name: name as string,
            },
          } as ChangeEvent<HTMLInputElement>,
          name
        )
      }
    },
    [onChange, maxLength, isInt, maxDecimalDigits, name, disableNumberSeparator]
  )

  const muiTextfieldProps: CTextFieldProps = useMemo(() => {
    const textfieldProps: CTextFieldProps = {
      value: innerValue ?? '',
      onChange: handleChangeNumber,
      onBlur: handleChangeCompleted,
      onFocus: handleChangeStarted,
      // onKeyDown: (e) => {
      //   e?.stopPropagation()
      //   if (e.key === 'Enter') {
      //     handleChangeCompleted(e as any)
      //   }
      // },
      ...rest,
      slotProps: {
        ...(slotProps ?? {}),
        input: {
          // eslint-disable-next-line no-useless-escape
          pattern: '\d*',
        },
      },
    }

    return textfieldProps
  }, [
    rest,
    innerValue,
    handleChangeNumber,
    handleChangeCompleted,
    handleChangeStarted,
    slotProps,
  ])

  return (
    <CTextField
      {...muiTextfieldProps}
      disableLabel={disableLabel}
      label={label}
      error={error}
      name={name}
      required={required}
      injectComponent={injectComponent}
      fullWidth
      ref={ref}
      maxLength={maxLength}
    />
  )
}
