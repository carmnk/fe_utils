import { useState, useCallback, ReactNode, forwardRef } from 'react'
import { useMemo, ChangeEvent, ForwardedRef } from 'react'
import { useTheme, InputAdornment, Box, TooltipProps } from '@mui/material'
import { TextField as MTextField } from '@mui/material'
import { TypographyProps, BoxProps, Typography } from '@mui/material'
import { TextFieldProps as MTextFieldProps } from '@mui/material'
import Icon from '@mdi/react'
import { InputFieldProps } from './types'

const requiredFieldText = 'This field is required'

export type CTextFieldProps = InputFieldProps<'text'> &
  Omit<
    MTextFieldProps,
    'value' | 'onChange' | 'inputProps' | 'InputProps' | 'FormHelperTextProps'
  > & {
    borderRadius?: number
    icon?: ReactNode
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

export const TextField = forwardRef(
  (props: CTextFieldProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      value,
      label,
      name,
      type,
      onChange,
      required,
      icon,
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

    const theme = useTheme()
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
        variant: 'caption',
        component: 'label',
        color: error ? theme.palette.error.main : undefined,
        paddingBottom: '4px',
      }
    }, [error, theme.palette.error.main])

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
          endAdornment: (
            // dont show if not present!
            <InputAdornment position="end">
              {(typeof icon === 'string' ? (
                <Icon path={icon} size={1} />
              ) : (
                icon
              )) ?? null}
            </InputAdornment>
          ),
          startAdornment: (
            // dont show if not present? -> probably already no width
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          sx: {
            height: props?.multiline ? undefined : 42,
            fontSize: '14px !important',
            borderColor: 'transparent !important',
            borderWidth: '0px !important',
            borderRadius,
            ...(inputContainer?.sx ?? {}),
          },
          ...inputContainer,
        },
        FormHelperTextProps: {
          sx: {
            ...(formHelperText?.sx ?? {}),
            ml: '2px',
            height: disableHelperText ? '0px' : 23,
            mt: disableHelperText ? 0 : 0.5,
            whiteSpace: 'nowrap',
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
      icon,
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
        <MTextField ref={ref} {...textFieldProps} />
        {injectComponent}
      </Box>
    )
  }
)
TextField.displayName = 'CTextField'
export default TextField
