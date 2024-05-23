import { useState, useCallback, ReactNode, forwardRef } from 'react'
import { useMemo, ChangeEvent, ForwardedRef } from 'react'
import { InputAdornment, Box, TooltipProps } from '@mui/material'
import { TextField as MTextField } from '@mui/material'
import { TypographyProps, BoxProps, Typography } from '@mui/material'
import { TextFieldProps as MTextFieldProps } from '@mui/material'
import Icon from '@mdi/react'
import { GenericInputFieldProps } from './types'
import {
  defaultInputContainerTextFieldStyles,
  defaultLabelTextFieldStyles,
} from './defaultTextFieldStyles'

const requiredFieldText = 'This field is required'

export type SpecificMuiTextFieldProps = Omit<
  MTextFieldProps,
  | (
      | 'inputProps'
      | 'InputProps'
      | 'FormHelperTextProps'
      | 'slotProps'
      | 'InputLabelProps'
      | 'SelectProps'
    )
  | keyof GenericInputFieldProps<'text'>
>

export type CustomTextFieldProps = {
  borderRadius?: number
  endIcon?: ReactNode
  startIcon?: ReactNode
  injectComponent?: ReactNode
  slotProps?: {
    rootContainer?: BoxProps
    inputContainer?: MTextFieldProps['InputProps']
    input?: MTextFieldProps['inputProps']
    tooltip?: TooltipProps
    formHelperText?: MTextFieldProps['FormHelperTextProps']
    notchedInputLabel?: MTextFieldProps['InputLabelProps']
    label?: TypographyProps
  }
}

export type CTextFieldProps = GenericInputFieldProps<'text'> &
  SpecificMuiTextFieldProps &
  CustomTextFieldProps

export const CTextField = forwardRef(
  (props: CTextFieldProps, ref: ForwardedRef<any>) => {
    const {
      value,
      label,
      name,
      type,
      onChange,
      required,
      endIcon,
      helperText,
      startIcon,
      disableHelperText,
      disableLabel,
      error,
      injectComponent,
      onChangeCompleted,
      maxLength,
      disabled,
      useNotchedLabel,
      notchedLabelBgColor,
      notchedLabelMarginLeft = 24,
      borderRadius,
      slotProps,
      ...rest
    } = props

    const {
      inputContainer,
      input,
      label: labelProps,
      formHelperText,
      notchedInputLabel,
      rootContainer,
    } = slotProps ?? {}

    // console.warn('PROPS TEXTFIELD', props)

    // const theme = useTheme()
    const [valueStarted, setValueStarted] = useState('')

    const handleChangeCompleted = useCallback(() => {
      //dont trigger if value has not changed
      if (
        typeof value === 'undefined' ||
        value === null ||
        value.toString() === valueStarted
      )
        return
      onChangeCompleted?.(value)
    }, [onChangeCompleted, value, valueStarted])

    const handleChangeStarted = useCallback(() => {
      if (!value) return
      setValueStarted?.(value?.toString?.())
    }, [value])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value
        onChange?.(newValue ?? '', e, name)
      },
      [onChange, name]
    )

    const defaultLabelProps: TypographyProps = useMemo(() => {
      return {
        ...defaultLabelTextFieldStyles,
        color: error ? 'error.main' : disabled ? 'action.disabled' : undefined,
      }
    }, [error, disabled])

    const textFieldProps: MTextFieldProps = useMemo(() => {
      return {
        type,
        value: value ?? '',
        size: 'small',
        disabled: disabled,
        name,
        onChange: handleChange,
        error,
        required,
        helperText: disableHelperText
          ? undefined
          : helperText || (error ? requiredFieldText : ' '),
        onBlur: handleChangeCompleted,
        onFocus: handleChangeStarted,
        ...rest,
        variant: (rest.variant ?? 'outlined') as any,
        inputProps: {
          maxLength,
          title: name,
          ...input,
        },
        InputLabelProps: notchedInputLabel,
        InputProps: {
          notched: false,
          endAdornment: endIcon ? (
            // dont show if not present!
            <InputAdornment position="end">
              {(typeof endIcon === 'string' ? (
                <Icon path={endIcon} size={1} />
              ) : (
                endIcon
              )) ?? null}
            </InputAdornment>
          ) : undefined,
          startAdornment: startIcon ? (
            // dont show if not present? -> probably already no width
            <InputAdornment position="start">
              {(typeof startIcon === 'string' ? (
                <Icon path={startIcon} size={1} />
              ) : (
                startIcon
              )) ?? null}
            </InputAdornment>
          ) : undefined,
          sx: {
            ...defaultInputContainerTextFieldStyles,
            height: props?.multiline ? undefined : 42,
            borderRadius,
            ...(inputContainer?.sx ?? {}),
          },
          ...inputContainer,
        },
        FormHelperTextProps: {
          sx: {
            ml: '2px',
            textAlign: 'left',
            height: disableHelperText ? '0px' : undefined,
            mt: disableHelperText ? 0 : 0.5,
            whiteSpace: 'nowrap',
            ...(formHelperText?.sx ?? {}),
          },
          ...formHelperText,
        },
        sx: {
          ...(rest?.sx ?? {}),
          ...(useNotchedLabel
            ? {
                '& >label': {
                  transform: `translate(${notchedLabelMarginLeft}px, -9px) scale(0.75)`,
                  bgcolor: notchedLabelBgColor ?? 'background.default',
                  px: '4px',
                },
              }
            : {}),
        },
        label: useNotchedLabel ? label : undefined,
      }
    }, [
      endIcon,
      rest,
      startIcon,
      name,
      maxLength,
      disabled,
      handleChange,
      handleChangeCompleted,
      handleChangeStarted,
      helperText,
      error,
      required,
      type,
      value,
      disableHelperText,
      useNotchedLabel,
      label,
      borderRadius,
      notchedLabelBgColor,
      notchedLabelMarginLeft,
      props?.multiline,
      formHelperText,
      inputContainer,
      input,
      notchedInputLabel,
    ])

    return (
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        width="100%"
        minWidth="240px"
        {...(rootContainer ?? {})}
      >
        {!disableLabel && !useNotchedLabel && (
          <Typography {...defaultLabelProps} {...(labelProps ?? {})}>
            {label}{' '}
            {required && (
              <Box component="strong" color="error.main" fontWeight="700">
                *
              </Box>
            )}
          </Typography>
        )}
        <MTextField {...textFieldProps} ref={ref} />
        {injectComponent}
      </Box>
    )
  }
)
CTextField.displayName = 'CTextField'
export default CTextField
