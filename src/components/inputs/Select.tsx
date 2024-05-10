import { ChangeEvent, useMemo, useCallback } from 'react'
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
import { BoxProps } from '@mui/material/Box'
import { CommonInputFieldProps, InputFieldProps } from './types'

export type CSelectProps = CommonInputFieldProps &
  InputFieldProps<'select'> &
  Omit<SelectProps, 'onChange' | 'variant' | 'options'> & {
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

const requiredFieldText = 'This field is required'

const menuItemStyles = {
  fontSize: 14,
  lineHeight: '16px',
  color: '#212529',
  minHeight: { xs: 28 },
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
  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      const value = e?.target?.value
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      onChange?.(value as never, e as any)
    },
    [onChange]
  )

  const themeErrorText = useMemo(() => {
    return {
      color: theme.palette.error.main,
      fontWeight: 700,
    }
  }, [theme.palette.error.main])

  const selectStyles = useMemo(() => {
    return {
      height: size === 'small' ? 32 : 40,
      pt: !disableTopPadding ? 1 : 0,
      width: '100%',
      fontSize: 14,
      lineHeight: '16px',
      ...(props?.sx ?? {}),
    }
  }, [props?.sx, disableTopPadding, size])

  const formHelperTextStyles = useMemo(() => {
    return {
      ...(props?.sx ?? {}),
      ...(error ? themeErrorText : {}),
    }
  }, [props?.sx, error, themeErrorText])

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

  const muiSlotProps = useMemo(() => {
    return {
      // ...(slotProps ?? {}),
      ...(inputCombobox ? { input: inputCombobox } : {}),
      ...(inputContainer ? { root: inputContainer } : {}),
    }
  }, [inputCombobox, inputContainer])

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
          {required && <strong style={themeErrorText}> *</strong>}
        </Typography>
      )}
      <MSelect
        value={value ?? ''}
        onChange={handleChange as any}
        error={!!error}
        size={size}
        disabled={isDisabledAdj}
        sx={selectStyles}
        fullWidth
        inputProps={{ title: name, name: name, ...inputProps }}
        SelectDisplayProps={selectDisplay}
        MenuProps={menuProps}
        slotProps={muiSlotProps}
        {...rest}
      >
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
