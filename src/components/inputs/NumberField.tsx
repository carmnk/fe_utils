import React, { ForwardedRef, useMemo } from 'react'
import TextField, { CTextFieldProps } from './TextField'

const formatGermanNumberString = (
  number: number,
  digits?: number,
  disableNumberSeparator?: boolean,
  minDigits?: number
) => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: minDigits ?? 0,
    maximumFractionDigits: digits || undefined,
  })
    .format(number)
    ?.replaceAll(disableNumberSeparator ? '.' : '', '')
}

export type CNumberFieldProps = Omit<CTextFieldProps, 'value'> & {
  value?: number | '' | null
  isInt?: boolean
  disableNumberSeparator?: boolean
  maxDecimalDigits?: number
  onChange?: (newValue: number, e: React.ChangeEvent<HTMLInputElement>) => void
}

export const NumberField = React.forwardRef(
  (props: CNumberFieldProps, ref: ForwardedRef<any>) => {
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
      disableNumberSeparator,
      isInt,
      maxDecimalDigits = 3,
      slotProps,
      ...rest
    } = props

    const [innerValue, setInnerValue] = React.useState<string | undefined>(
      undefined
    )
    const [valueStarted, setValueStarted] = React.useState('')

    React.useEffect(() => {
      const isLastCharComma = innerValue?.slice?.(-1) === ','
      const innerValueString = (
        isLastCharComma ? innerValue.slice(0, -1) : innerValue
      )
        ?.replaceAll('.', '')
        ?.replaceAll(',', '.')
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
            : ''
        )
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
            : ''
        )
      }
    }, [value])

    const handleChangeCompleted = React.useCallback(
      (e: any) => {
        //dont trigger if value has not changed
        if (
          typeof value === 'undefined' ||
          value === null ||
          value.toString() === valueStarted
        )
          return
        onChangeCompleted?.(value as any, e, name)
      },
      [onChangeCompleted, value, valueStarted, name]
    )

    const handleChangeStarted = React.useCallback(() => {
      if (!value) return
      setValueStarted?.(value?.toString?.())
    }, [value])

    const handleChangeNumber = React.useCallback(
      (
        newValue: string,
        e: React.ChangeEvent<HTMLInputElement>,
        name?: string
      ) => {
        // const { name, value: valueIn } = e.target
        let valueInAdj = newValue.replaceAll('.', '')
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
          const allowedDecimalChars = [...allowedPureNumberChars, ',']
          const allowedChars = isInt
            ? allowedPureNumberChars
            : allowedDecimalChars
          if (!allowedChars?.includes(valueInAdj?.substring(i, i + 1)))
            isNumeric = false
        }
        if (!isNumeric) return
        const amtCommas = valueInAdj?.match(/,/g)
        if ((amtCommas?.length || 0) > 1) return

        const posComma = valueInAdj.lastIndexOf(',')
        if (posComma !== -1) {
          if (posComma < valueInAdj.length - 1 - maxDecimalDigits) {
            valueInAdj = valueInAdj.slice(0, posComma + 1 + maxDecimalDigits)
          }
        }

        if (!valueInAdj) {
          onChange?.(
            '' as any,
            {
              ...e,
              target: { ...(e?.target ?? {}), value: '', name: name as any },
            },
            name
          )
          // setInnerValue('')
        } else {
          const posComma = valueInAdj.indexOf(',')
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
          const value = parseFloat(valueInAdj?.replaceAll(',', '.'))
          const charsAfterComma = valueInAdj.slice(posComma + 1)

          const isLastCharComma = valueInAdj.slice(-1) === ','
          const newInnerValueRaw = isLastCharComma
            ? valueInAdj.slice(0, -1)
            : valueInAdj
          const newInnerValueNumber = parseFloat(
            newInnerValueRaw?.replaceAll(',', '.')
          )
          // const newInnerValue =
          //   formatGermanNumberString(
          //     newInnerValueNumber || 0,
          //     typeof maxDecimalDigits === 'number' && maxDecimalDigits > 3
          //       ? maxDecimalDigits
          //       : undefined,
          //     disableNumberSeparator,
          //     posComma !== -1 && charsAfterComma?.length
          //       ? Math.min(charsAfterComma?.length, maxDecimalDigits)
          //       : undefined
          //   ) + (isLastCharComma ? ',' : '')
          // setInnerValue(newInnerValue)
          onChange?.(
            value as any,
            {
              ...e,
              target: {
                ...(e?.target ?? {}),
                value: value as any,
                name: name as any,
              },
            },
            name
          )
        }
      },
      [onChange, maxLength, isInt, disableNumberSeparator, maxDecimalDigits]
    )

    const muiTextfieldProps: CTextFieldProps = useMemo(() => {
      const textfieldProps: CTextFieldProps = {
        value: innerValue ?? '',
        onChange: handleChangeNumber,
        onBlur: handleChangeCompleted,
        onFocus: handleChangeStarted,
        ...(rest as any),
        slotProps,
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
      <TextField
        {...muiTextfieldProps}
        disableLabel={disableLabel}
        label={label}
        error={error}
        required={required}
        injectComponent={injectComponent}
        fullWidth
        ref={ref}
      />
    )
  }
)
NumberField.displayName = 'CNumberField'
