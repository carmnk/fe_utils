import { useState, useCallback, ReactNode, Ref } from 'react'
import { useMemo, ChangeEvent } from 'react'
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
import { Flex } from '../_wrapper'
import { mdiInformation } from '@mdi/js'
import { Button } from '../buttons'
import { parseSimpleFormating } from '../../utils/formatReactText'

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
      | 'ref'
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
    select?: MTextFieldProps['SelectProps']
  }
  labelRightInfo?: string
}

export type CTextFieldProps = GenericInputFieldProps<'text'> &
  SpecificMuiTextFieldProps &
  CustomTextFieldProps & { ref?: Ref<HTMLInputElement> }

export const CTextField = (props: CTextFieldProps) => {
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
    labelRightInfo,
    ref,
    ...rest
  } = props

  const {
    inputContainer,
    input,
    label: labelProps,
    formHelperText,
    notchedInputLabel,
    rootContainer,
    select,
  } = slotProps ?? {}

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
      paddingBottom: labelRightInfo ? 0 : '4px',
    }
  }, [error, disabled, labelRightInfo])

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
      variant: rest.variant ?? 'outlined',
      inputProps: {
        maxLength,
        title: name,
        ...input,
      },
      SelectProps: select,
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
    select,
  ])

  const labelRightInfoTooltip = useMemo(() => {
    return (
      labelRightInfo &&
      (parseSimpleFormating(labelRightInfo) as unknown as string)
    )
  }, [labelRightInfo])

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      width="100%"
      {...(rootContainer ?? {})}
    >
      {!disableLabel && !useNotchedLabel && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb={labelRightInfo ? 0.5 : 0}
        >
          <Typography {...defaultLabelProps} {...(labelProps ?? {})}>
            {label}{' '}
            {required && (
              <Box component="strong" color="error.main" fontWeight="700">
                *
              </Box>
            )}
          </Typography>
          {labelRightInfo && (
            <Button
              variant="outlined"
              iconButton
              icon={mdiInformation}
              tooltip={labelRightInfoTooltip}
            />
          )}
        </Flex>
      )}
      <MTextField {...textFieldProps} ref={ref} />
      {injectComponent}
    </Box>
  )
}
CTextField.displayName = 'CTextField'
