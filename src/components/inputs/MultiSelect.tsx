import { ReactNode, useCallback, useMemo } from 'react'
import { Select, MenuItem, useTheme, FormHelperText } from '@mui/material'
import { FormControl, SelectProps, FormControlProps } from '@mui/material'
import { Typography, SelectChangeEvent, BoxProps } from '@mui/material'
import { ListItemText, Checkbox } from '@mui/material'
import { CommonInputFieldProps } from './types'

const requiredFieldText = 'This field is required'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}
const menuItemStyles = {
  minHeight: { xs: 28 },
  fontSize: 14,
  lineHeight: '16px',
  pl: 0.5,
}
const optionItemTextStyles = { fontSize: 14, lineHeight: '16px' }

type SpecificSelectChangeEvent = SelectChangeEvent<
  (string | number | boolean)[]
>
export type MultiSelectProps = CommonInputFieldProps &
  Omit<SelectProps, 'onChange' | 'defaultValue'> & {
    disableTopPadding?: boolean
    value?: (string | number | boolean)[]
    options?: {
      value: string | number | boolean
      label: React.ReactNode
      textLabel: string
    }[]
    disableHelperText?: boolean
    disableLabel?: boolean
    labelSx?: BoxProps['sx']
    ContainerProps?: FormControlProps
    onChange?:
      | ((newValue: string[], e: SpecificSelectChangeEvent) => void)
      | ((newValue: number[], e: SpecificSelectChangeEvent) => void)
      | ((newValue: boolean[], e: SpecificSelectChangeEvent) => void)
    defaultValue?: (string | number | boolean)[]
  }

export const MultiSelect = (props: MultiSelectProps) => {
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
    placeholder,
    helperText,
    name,
    ...rest
  } = props

  const theme = useTheme()
  const handleChange = useCallback(
    (e: SpecificSelectChangeEvent) => {
      const value = e?.target?.value
      onChange?.(value as never, e)
    },
    [onChange]
  )
  const labelNode: ReactNode = useMemo(
    () => (
      <Typography
        variant="caption"
        component="label"
        style={error ? { color: theme.palette.error.main } : {}}
        sx={labelSx}
      >
        {label}
        {required && (
          <strong
            style={{
              color: theme.palette.error.main,
              fontWeight: 700,
            }}
          >
            {' '}
            *
          </strong>
        )}
      </Typography>
    ),
    [label, required, theme, labelSx, error]
  )
  const helperTextProps = useMemo(
    () => ({
      sx: {
        ml: '2px',
        height: 23,
        color: helperText ? 'text.primary' : 'error.main',
      },
    }),
    [helperText]
  )

  const selectProps: SelectProps<(string | number | boolean)[]> =
    useMemo(() => {
      return {
        ...rest,
        multiple: true,
        value: value ?? '',
        onChange: handleChange,
        error: !!error,
        size: 'small',
        disabled,
        sx: {
          height: 42,
          pt: !disableTopPadding ? 1 : 0,
          width: '100%',
          background: 'white',
          fontSize: 14,
          lineHeight: '16px',
          color: value?.length ? '#212529' : '#21252999',
          ...(props?.sx ?? {}),
        },
        inputProps: {
          title: name,
          name: name,
          placeholder: placeholder,
        },
        // input={<OutlinedInput label="Tag" />}
        renderValue: (selectedIds) => {
          const selectedOptions =
            options
              ?.filter((opt) => selectedIds.includes(opt.value))
              ?.map((opt) => opt.textLabel) ?? []
          return selectedOptions?.length
            ? selectedOptions.join(', ')
            : placeholder
        },
        displayEmpty: true,
        MenuProps,
      }
    }, [
      disableTopPadding,
      name,
      value,
      disabled,
      error,
      handleChange,
      options,
      placeholder,
      props.sx,
      rest,
    ])

  return (
    <FormControl {...ContainerProps}>
      {!disableLabel && labelNode}
      <Select {...selectProps}>
        {options?.map((opt, oIdx) => (
          <MenuItem value={opt?.value as any} key={oIdx} sx={menuItemStyles}>
            <Checkbox
              checked={(value || []).indexOf(opt.value) > -1}
              size={'small'}
            />
            <ListItemText
              disableTypography
              sx={optionItemTextStyles}
              primary={opt.label}
            />
          </MenuItem>
        ))}
      </Select>
      {!disableHelperText && (
        <FormHelperText {...helperTextProps}>
          {helperText ?? (error ? requiredFieldText : ' ')}
        </FormHelperText>
      )}
    </FormControl>
  )
}
