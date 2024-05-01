import { useState, useCallback, ReactNode, forwardRef } from 'react'
import { useMemo, ChangeEvent, ForwardedRef } from 'react'
import { useTheme, InputAdornment, Box } from '@mui/material'
import { TextField as MTextField } from '@mui/material'
import { TypographyProps, BoxProps, Typography } from '@mui/material'
import { TextFieldProps as MTextFieldProps } from '@mui/material'
import Icon from '@mdi/react'
import { mdiLock } from '@mdi/js'
import { CommonInputFieldProps } from './_types'

const requiredFieldText = 'This field is required'

export type TextFieldProps = Omit<MTextFieldProps, 'onChange'> &
  CommonInputFieldProps & {
    value?: string | number | null
    icon?: ReactNode // does not support mdiIcons/ mdiStrings
    inputStyle?: Required<MTextFieldProps>['InputProps']['sx']
    startIcon?: ReactNode
    disableHelperText?: boolean
    disableLabel?: boolean
    ContainerProps?: BoxProps
    labelSx?: TypographyProps['sx']
    injectComponent?: ReactNode
    locked?: boolean
    useNotchedLabel?: boolean
    onChange?: (
      newValue: string | number,
      e: ChangeEvent<HTMLInputElement>
    ) => void
    onChangeCompleted?: (newValue: string | number) => void
    notchedLabelMarginLeft?: number
    borderRadius?: number
    notchedLabelBgColor?: string
  }

export const TextField = forwardRef(
  (props: TextFieldProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      value,
      label,
      name,
      type,
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
      locked,
      disabled,
      useNotchedLabel,
      notchedLabelBgColor,
      notchedLabelMarginLeft = 24,
      borderRadius,
      ...rest
    } = props

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
        onChange?.(newValue ?? '', e)
      },
      [onChange]
    )

    const labelProps: TypographyProps = useMemo(() => {
      return {
        variant: 'caption',
        component: 'label',
        color: error ? theme.palette.error.main : undefined,
        paddingBottom: '4px',
        // style: error ? { color: theme.palette.error.main } : {},
        sx: labelSx,
      }
    }, [labelSx, error, theme.palette.error.main])

    const textFieldProps: MTextFieldProps = useMemo(() => {
      return {
        type,
        value: value ?? '',
        size: 'small',
        disabled: disabled || locked,
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
        },
        InputProps: {
          notched: false,
          endAdornment: (
            // dont show if not present!
            <InputAdornment position="end">
              {(typeof icon === 'string' ? (
                <Icon path={icon} size={1} />
              ) : (
                icon
              )) ?? (locked ? <Icon path={mdiLock} /> : null)}
            </InputAdornment>
          ),
          startAdornment: (
            // dont show if not present? -> probably already no width
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          ...((rest?.InputProps as any) ?? {}),
          sx: {
            height: props?.multiline ? undefined : 42,
            ...(inputStyle ?? {}),
            fontSize: '14px !important',
            borderColor: 'transparent !important',
            borderWidth: '0px !important',
            borderRadius,
            ...(rest.InputProps?.sx ?? {}),
          },
        },
        FormHelperTextProps: {
          sx: {
            ...(rest?.FormHelperTextProps?.sx ?? {}),
            ml: '2px',
            height: disableHelperText ? '0px' : 23,
            mt: disableHelperText ? 0 : 0.5,
            whiteSpace: 'nowrap',
          },
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
      inputStyle,
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
      locked,
      disableHelperText,
      useNotchedLabel,
      label,
    ])

    return (
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        width="100%"
        {...(ContainerProps ?? {})}
      >
        {!disableLabel && !useNotchedLabel && (
          <Typography {...labelProps}>
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
