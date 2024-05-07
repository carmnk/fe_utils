import { ChangeEvent, useMemo, useCallback } from 'react'
import { Select as MSelect, MenuItem, useTheme } from '@mui/material'
import { FormHelperText, FormControl, SelectProps } from '@mui/material'
import { FormControlProps, SelectChangeEvent, Typography } from '@mui/material'
import { BoxProps } from '@mui/material/Box'
import { CommonInputFieldProps } from './types'

export type CSelectProps = CommonInputFieldProps &
  Omit<SelectProps, 'onChange' | 'variant' | 'options'> & {
    variant?: SelectProps['variant']
    disableTopPadding?: boolean
    value?: string | number | boolean | null
    options?: { value: string | number | boolean; label: string }[]
    disableHelperText?: boolean
    disableLabel?: boolean
    labelSx?: BoxProps['sx']
    ContainerProps?: FormControlProps
    onChange?:
      | ((newValue: string, e: ChangeEvent<HTMLInputElement>) => void)
      | ((newValue: number, e: ChangeEvent<HTMLInputElement>) => void)
      | ((newValue: boolean, e: ChangeEvent<HTMLInputElement>) => void)
    locked?: boolean
    // helperText?: string
    size?: string
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
    ContainerProps,
    name,
    locked,
    helperText,
    // disableHelperTextTheming,
    size,
    ...rest
  } = props
  const isDisabledAdj = disabled || locked

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
      height: !size || size === 'small' ? 32 : 42,
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
      ...(ContainerProps ?? {}),
      sx: {
        ...(ContainerProps?.sx ?? {}),
        // display: 'flex',
        // flexDirection: 'column',
        width: '100%',
      },
    }
  }, [ContainerProps])

  const labelSxAdj = useMemo(() => {
    return {
      ...labelSx,
      pb: 0.5,
    }
  }, [labelSx])

  return (
    <FormControl {...(containerPropsAdj as any)}>
      {!disableLabel && (
        <Typography
          variant="caption"
          component="label"
          style={error ? { color: theme.palette.error.main } : {}}
          sx={labelSxAdj}
        >
          {label}
          {required && <strong style={themeErrorText}> *</strong>}
        </Typography>
      )}
      <MSelect
        {...rest}
        value={value ?? ''}
        onChange={handleChange as any}
        error={!!error}
        size={size ?? 'small'}
        disabled={isDisabledAdj}
        sx={selectStyles}
        inputProps={{ title: name, name: name }}
      >
        {options?.map((opt, oIdx) => (
          <MenuItem value={opt?.value as any} key={oIdx} sx={menuItemStyles}>
            {opt.label}
          </MenuItem>
        ))}
      </MSelect>
      {!disableHelperText && (
        <FormHelperText sx={formHelperTextStyles}>
          {helperText ?? (error ? requiredFieldText : ' ')}
        </FormHelperText>
      )}
    </FormControl>
  )
}
