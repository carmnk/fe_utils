import { ChangeEvent, useMemo } from 'react'
import {
  FormHelperTextProps,
  Select as MSelect,
  MenuItem,
  MenuItemProps,
  TypographyProps,
  useTheme,
} from '@mui/material'
import { FormHelperText, FormControl, SelectProps } from '@mui/material'
import { SelectChangeEvent, Typography } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { GenericInputFieldProps } from './types'
import { CTextFieldProps } from './TextField'

export type CustomSelectProps = {
  variant?: SelectProps['variant']
  disableTopPadding?: boolean
  value?: string | number | boolean | null
  options?: { value: string | number | boolean; label: string }[]
  disableHelperText?: boolean
  disableLabel?: boolean
  labelSx?: BoxProps['sx']
  // ContainerProps?: FormControlProps
  onChange?:
    | ((newValue: string, e: ChangeEvent<HTMLInputElement>) => void)
    | ((newValue: number, e: ChangeEvent<HTMLInputElement>) => void)
    | ((newValue: boolean, e: ChangeEvent<HTMLInputElement>) => void)
  locked?: boolean
  // helperText?: string
  size?: string
  slotProps?: SelectProps['slotProps'] & {
    rootContainer?: BoxProps
    inputCombobox?: any // SelectProps['slotProps']['input']
    inputContainer?: any // SelectProps['slotProps']['root']
    input?: SelectProps['inputProps']
    selectDisplay?: SelectProps['SelectDisplayProps']
    menu?: SelectProps['MenuProps']
    formHelperText?: FormHelperTextProps
    label?: TypographyProps
    menuItem?: MenuItemProps
    // tooltip?: TooltipProps
  }
}

export type SpecificMuiTextFieldProps = Omit<
  CTextFieldProps,
  keyof CustomSelectProps
>

export type SpecificMuiSelectProps = Omit<
  SelectProps,
  | keyof CTextFieldProps
  | keyof GenericInputFieldProps<'select'>
  | keyof CustomSelectProps
>

export type CSelectProps = GenericInputFieldProps<'select'> &
  SpecificMuiTextFieldProps &
  SpecificMuiSelectProps &
  CustomSelectProps

const requiredFieldText = 'This field is required'
const menuItemStyles = {
  fontSize: 14,
  lineHeight: '16px',
  color: '#212529',
  minHeight: { xs: 28 },
}
const errorTextStyle = {
  color: 'error.main',
  fontWeight: 700,
}

export const Select = (props: CSelectProps) => {
  const {
    disableTopPadding,
    value,
    onChange,
    options,
    error,
    disabled,
    required,
    label,
    disableHelperText,
    disableLabel,
    labelSx,
    name,
    locked,
    helperText,
    // disableHelperTextTheming,
    size,
    slotProps,
    ...rest
  } = props
  const isDisabledAdj = disabled || locked

  const {
    inputCombobox,
    inputContainer,
    input: inputProps,
    selectDisplay,
    menu: menuProps,
    rootContainer,
    formHelperText,
    label: typography,
    menuItem: menuItemProps,
  } = slotProps ?? {}

  const theme = useTheme()

  const formHelperTextStyles = useMemo(() => {
    return {
      ...(props?.sx ?? {}),
      ...(error ? errorTextStyle : {}),
    }
  }, [props?.sx, error])
  const containerPropsAdj = useMemo(() => {
    return {
      ...(rootContainer ?? {}),
      sx: {
        width: '100%',
        minWidth: '240px',
        ...(rootContainer?.sx ?? {}),
      },
    }
  }, [rootContainer])
  const labelSxAdj = useMemo(() => {
    return {
      pb: 0.5,
      ...labelSx,
    }
  }, [labelSx])

  const muiSelectProps: SelectProps = useMemo(
    () => ({
      value: value ?? '',
      onChange: (e: SelectChangeEvent<unknown>) => {
        const value = e?.target?.value
        onChange?.(value as any, e as any, name)
      },
      error: !!error,
      size: size as any,
      disabled: isDisabledAdj,
      sx: {
        height: size === 'small' ? 32 : 40,
        pt: !disableTopPadding ? 1 : 0,
        width: '100%',
        fontSize: 14,
        lineHeight: '16px',
        ...(props?.sx ?? {}),
      },
      fullWidth: true,
      inputProps: { title: name, name: name, ...inputProps },
      SelectDisplayProps: selectDisplay,
      MenuProps: menuProps,

      slotProps: {
        // ...(slotProps ?? {}),
        ...(inputCombobox ? { input: inputCombobox } : {}),
        ...(inputContainer ? { root: inputContainer } : {}),
      },
      variant: rest?.variant as any,
      defaultValue: rest?.defaultValue as any,
      ...rest,
      onInvalid: rest?.onInvalid as any,
      margin: rest?.margin as any,
      onKeyUp: rest?.onKeyUp as any,
      onKeyDown: rest?.onKeyDown as any,
    }),
    [
      value,
      onChange,
      error,
      size,
      isDisabledAdj,
      name,
      inputProps,
      selectDisplay,
      menuProps,
      inputCombobox,
      inputContainer,
      disableTopPadding,
      props?.sx,
      rest,
    ]
  )

  return (
    <FormControl {...(containerPropsAdj as any)}>
      {!disableLabel && (
        <Typography
          variant="caption"
          component="label"
          style={error ? { color: theme.palette.error.main } : {}}
          sx={labelSxAdj}
          {...typography}
        >
          {label}
          {required && (
            <Box component="strong" sx={errorTextStyle}>
              {' '}
              *
            </Box>
          )}
        </Typography>
      )}
      <MSelect {...muiSelectProps}>
        {options?.map((opt, oIdx) => (
          <MenuItem
            value={opt?.value as any}
            key={oIdx}
            sx={menuItemStyles}
            {...menuItemProps}
          >
            {opt.label}
          </MenuItem>
        ))}
      </MSelect>
      {!disableHelperText && (
        <FormHelperText sx={formHelperTextStyles} {...formHelperText}>
          {helperText ?? (error ? requiredFieldText : ' ')}
        </FormHelperText>
      )}
    </FormControl>
  )
}
