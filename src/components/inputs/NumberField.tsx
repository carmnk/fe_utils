import React, { useMemo } from 'react'
import { InputAdornment, Box, useTheme } from '@mui/material'
import {
  // TextField as MTextField,
  // TextFieldProps as MTextFieldProps,
  // Typography,
} from '@mui/material'
import TextField, { TextFieldProps } from './TextField'

export const formatGermanNumberString = (
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

const REQUIRED_FIELD_HELPER_TEXT = 'This field is required'

export type CNumberFieldProps = Omit<TextFieldProps, 'value'> & {
  value?: number | '' | null
  isInt?: boolean
  disableNumberSeparator?: boolean
  maxDecimalDigits?: number
  onChange?: (newValue: number, e: React.ChangeEvent<HTMLInputElement>) => void
}

export const NumberField = React.forwardRef((props: CNumberFieldProps, ref) => {
  const {
    value,
    label,
    name,
    onChange,
    required,
    icon,
    inputStyle,
    helperText,
    startIcon,
    disableHelperText,
    disableLabel,
    error,
    ContainerProps,
    labelSx,
    injectComponent,
    onChangeCompleted,
    maxLength,
    defaultValue,
    disableNumberSeparator,
    isInt,
    maxDecimalDigits = 3,
    ...rest
  } = props

  const theme = useTheme()
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

  const handleChangeCompleted = React.useCallback(() => {
    //dont trigger if value has not changed
    if (
      typeof value === 'undefined' ||
      value === null ||
      value.toString() === valueStarted
    )
      return
    onChangeCompleted?.(value)
  }, [onChangeCompleted, value, valueStarted])

  const handleChangeStarted = React.useCallback(() => {
    if (!value) return
    setValueStarted?.(value?.toString?.())
  }, [value])

  const handleChangeNumber = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: valueIn } = e.target
      console.log('EVT', e)
      let valueInAdj = valueIn.replaceAll('.', '')
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
        onChange?.('' as any, {
          ...e,
          target: { ...(e?.target ?? {}), value: '', name },
        })
        setInnerValue('')
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
          ) + (isLastCharComma ? ',' : '')
        setInnerValue(newInnerValue)
        console.log('NEW VAL EVT', name, value, e)
        onChange?.(value, {
          ...e,
          target: { ...(e?.target ?? {}), value: value as any, name },
        })
      }
    },
    [onChange, maxLength, isInt, disableNumberSeparator, maxDecimalDigits]
  )

  const themeErrorText = {
    color: theme.palette.error.main,
    fontWeight: 700,
  }

  const muiTextfieldProps: TextFieldProps = useMemo(() => {
    return {
      value: innerValue ?? '',
      size: 'small',
      name: name,
      onChange: handleChangeNumber,
      error: error,
      required: required,
      helperText: disableHelperText
        ? undefined
        : helperText || (error ? REQUIRED_FIELD_HELPER_TEXT : ' '),
      onBlur: handleChangeCompleted,
      onFocus: handleChangeStarted,
      ...(rest as any),
      inputProps: { ref, maxLength, title: name },
      InputProps: {
        endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
        startAdornment: (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        ...(rest?.InputProps ?? {}),
        sx: {
          height: 42,
          ...(inputStyle ?? {}),
          fontSize: 14,
          lineHeight: '16px',
          borderColor: 'transparent !important',
          borderWidth: '0px !important',
          ...(rest.InputProps?.sx ?? {}),
        },
      },
      FormHelperTextProps: {
        sx: {
          ml: '2px',
          height: disableHelperText ? '0px' : 23,
          mt: disableHelperText ? 0 : 0.5,
          whiteSpace: 'nowrap',
        },
      },
    }
  }, [
    disableHelperText,
    helperText,
    icon,
    error,
    name,
    required,
    rest,
    startIcon,
    innerValue,
    handleChangeNumber,
    handleChangeCompleted,
    handleChangeStarted,
    maxLength,
    inputStyle,
    ref,
  ])

  return (
    // <Box
    //   position="relative"
    //   display="flex"
    //   flexDirection="column"
    //   width="100%"
    //   {...(ContainerProps ?? {})}
    // >
    //   {!disableLabel && (
    //     <Box pb={0.25} pl={0.25}>
    //       <Typography
    //         variant="caption"
    //         fontSize="14px"
    //         color={error ? 'error.main' : undefined}
    //         sx={labelSx}
    //       >
    //         {label} {required && <strong style={themeErrorText}>*</strong>}
    //       </Typography>
    //     </Box>
    //   )}
    //   <MTextField {...muiTextfieldProps} />
    //   {injectComponent}
    // </Box>
    <TextField
      {...muiTextfieldProps}
      disableLabel={disableLabel}
      label={label}
      error={error}
      labelSx={labelSx}
      required={required}
      
      injectComponent={injectComponent}
      fullWidth
      // onChange={(newValue: string | number, e: any) => {
      //   muiTextfieldProps?.onChange?.(e)
      // }}
    />
  )
})
NumberField.displayName = 'CNumberField'
