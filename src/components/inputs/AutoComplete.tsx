import { ReactNode, ChangeEvent, SyntheticEvent, useState, useRef } from 'react'
import { useCallback, FocusEvent, KeyboardEvent, useEffect } from 'react'
import { Fragment, KeyboardEventHandler, useMemo } from 'react'
import {
  Autocomplete,
  TextField as MTextField,
  TextFieldProps,
  FormControl,
  useTheme,
  TypographyProps,
  FormHelperTextProps,
} from '@mui/material'
import { FormHelperText, CircularProgress, Typography } from '@mui/material'
import { FormControlProps, AutocompleteProps, Box } from '@mui/material'
import { CommonInputFieldProps } from './types'
import TextField, { CTextFieldProps } from './TextField'

const requiredFieldText = 'This field is required'

export type CAutoCompleteProps = CommonInputFieldProps &
  Omit<
    AutocompleteProps<string, false, false, boolean>,
    'options' | 'renderInput' | 'onChange' | 'onInputChange' | 'slotProps'
  > & {
    onChange?: (newValue: string, e: ChangeEvent<HTMLInputElement>) => void
    onInputChange?: (
      newValue: string,
      e: SyntheticEvent<Element, Event>
    ) => void
    loading?: boolean
    freeSolo?: boolean
    disableHelperText?: boolean
    disableLabel?: boolean
    options: { value: string; label: string }[]
    onKeyUp?: (e?: KeyboardEventHandler<HTMLInputElement>) => void
    value: string
    renderInput?: AutocompleteProps<
      string,
      false,
      false,
      boolean
    >['renderInput']
    slotProps?: AutocompleteProps<string, false, false, boolean>['slotProps'] &
      CTextFieldProps['slotProps'] & {
        label?: TypographyProps
        rootContainer?: FormControlProps
        formHelperText?: FormHelperTextProps
      }
  }

const injectFieldNameToEvent = (
  e: SyntheticEvent<HTMLInputElement, HTMLInputElement>,
  name: string
): ChangeEvent<HTMLInputElement> =>
  ({
    ...(e ?? {}),
    target: { ...(e?.target ?? {}), name },
  }) as unknown as ChangeEvent<HTMLInputElement>

const formHelperTextStyles = { ml: '2px', color: 'error.main' }

export const CAutoComplete = (props: CAutoCompleteProps) => {
  const {
    label,
    onChange,
    onInputChange,
    error,
    required,
    loading,
    freeSolo,
    disableHelperText,
    disableLabel,
    // ContainerProps,
    helperText,
    name,
    options,
    onKeyUp,
    value,
    slotProps,
    ...restProps
  } = props

  const {
    label: labelProps,
    rootContainer,
    formHelperText: formHelperTextProps,
    input,
    tooltip,
    notchedInputLabel,
    inputContainer,
    ...muiSlotProps
  } = slotProps ?? {}

  const freeSoloInt = freeSolo ?? true
  const initValue = options?.find?.((opt) => opt?.value === value)?.label || ''

  const [inputValue, setInputValue] = useState(initValue ?? '')
  const theme = useTheme()
  const isFocussed = useRef(false)
  const isChanging = useRef(false)

  const injectedOnChange = useCallback(
    (
      e: SyntheticEvent<HTMLInputElement, HTMLInputElement>,
      newValue:
        | string
        | {
            value: string
            label: ReactNode
          }
        | null
    ) => {
      const value =
        ['string', 'number', 'boolean'].includes(typeof newValue) ||
        typeof newValue === 'string'
          ? (newValue as string)
          : newValue
            ? newValue?.value
            : ''
      isChanging.current = true
      const event = name ? injectFieldNameToEvent(e, name) : (e as any)
      onChange?.(value, event)
    },
    [onChange, name]
  )
  const injectedOnInputChange = useCallback(
    (e: SyntheticEvent<Element, Event>, newValue: string) => {
      if (e?.type === 'keydown' || e?.type !== 'change') return
      setInputValue(newValue)
      onInputChange?.(newValue ?? '', e)
    },
    [onInputChange]
  )

  const handleEnter = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement> &
        SyntheticEvent<HTMLInputElement, HTMLInputElement>
    ) => {
      if (e?.key === 'Enter' && !isChanging.current) {
        const option = options?.find((opt) => opt?.label === inputValue)?.value
        const valueAdj = option ?? (freeSoloInt ? inputValue : '')
        const event = name ? injectFieldNameToEvent(e, name) : (e as any)
        onChange?.(valueAdj, event)
      }
    },
    [inputValue, onChange, options, name, freeSoloInt]
  )

  const handleBlur = useCallback(
    (
      e: FocusEvent<HTMLInputElement> &
        SyntheticEvent<HTMLInputElement, HTMLInputElement>
    ) => {
      isFocussed.current = false
      // if (!freeSoloInt) return
      const option = options?.find((opt) => opt?.label === inputValue)?.value
      const valueAdj = option ?? (freeSoloInt ? inputValue : '')
      const event = name ? injectFieldNameToEvent(e, name) : (e as any)
      onChange?.(valueAdj, event)
      if (!freeSoloInt && !option) setInputValue('')
    },
    [inputValue, onChange, freeSoloInt, options, name]
  )

  const themeErrorText = useMemo(() => {
    return {
      color: theme.palette.error.main,
      fontWeight: 700,
    }
  }, [theme.palette.error.main])

  const inputStyles = useMemo(() => {
    return {
      height: 42,
      p: 0,
      width: '100%',
      fontSize: 14,
      lineHeight: '16px',
      color: theme.palette.text.primary,
      ...((restProps as any)?.sx ?? {}),
    }
  }, [theme.palette.text.primary, restProps])

  const labelErrorStyles = useMemo(() => {
    return {
      color: theme.palette.error.main,
    }
  }, [theme.palette.error.main])

  const renderOption = useCallback(
    (props: any, option: any) => (
      <Box fontSize={14} component="li" {...props}>
        {option?.label}
      </Box>
    ),
    []
  )

  const renderInput = useCallback(
    (params: TextFieldProps) => {
      const onChange = (newValue: string) => {
        const eventValue = {
          target: {
            value: newValue,
          },
        }
        params?.onChange?.(eventValue as any)
      }
      return (
        <TextField
          {...params}
          rows={params?.rows as any}
          value={params?.value as string}
          onChange={onChange}
          name={name}
          error={!!error}
          slotProps={{ input, inputContainer,  }}
        />
      )
    },
    [error, name]
  )

  // update inner inputValue when outer value is changed
  useEffect(() => {
    // try to map with options
    const initValue =
      options?.find?.((opt) => opt?.value === value)?.label ||
      (freeSoloInt ? value : '')
    setInputValue(initValue)
    isChanging.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    // try to map with options
    if (!options?.length || isFocussed.current) return
    const initValue =
      options?.find((opt) => opt?.value === value)?.label ||
      (freeSoloInt ? value : '')
    setInputValue(initValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  useEffect(() => {
    isChanging.current = false
  }, [inputValue])

  const handleFocus = useCallback(() => {
    isFocussed.current = true
  }, [])

  return (
    <FormControl
      sx={{ width: '100%', minWidth: 240 }}
      className="flex flex-col w-full"
      {...rootContainer}
    >
      {!disableLabel && (
        <Typography
          variant="caption"
          style={error ? labelErrorStyles : undefined}
          paddingBottom={'4px'}
          {...labelProps}
        >
          {label}
          {required && <strong style={themeErrorText}> *</strong>}
        </Typography>
      )}
      <Autocomplete
        options={options as any}
        noOptionsText={
          'no optionen available' + (inputValue ? ` for "${inputValue}"` : '')
        }
        {...restProps}
        freeSolo={freeSoloInt}
        renderInput={renderInput}
        onFocus={handleFocus}
        onChange={injectedOnChange as any}
        inputValue={inputValue}
        value={inputValue}
        onInputChange={injectedOnInputChange}
        onBlur={handleBlur}
        onKeyUp={onKeyUp || handleEnter}
        loading={loading}
        size="small"
        sx={inputStyles}
        renderOption={renderOption}
        slotProps={{
          ...muiSlotProps,
          popper: {
            ...(muiSlotProps.popper ?? {}),
            sx: { ...(muiSlotProps?.popper?.sx ?? {}), zIndex: 999999 },
          },
        }}
      />
      {!disableHelperText && (
        <FormHelperText sx={formHelperTextStyles} {...formHelperTextProps}>
          {helperText ? helperText : error ? requiredFieldText : ' '}
        </FormHelperText>
      )}
    </FormControl>
  )
}
