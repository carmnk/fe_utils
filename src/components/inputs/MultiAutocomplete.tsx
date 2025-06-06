import { ChangeEvent, ReactNode, useCallback, useMemo } from 'react'
import { useTheme, FormHelperText, Chip, ChipProps } from '@mui/material'
import { Autocomplete, TextField, Tooltip, TextFieldProps } from '@mui/material'
import { FormControl, FormControlProps, AutocompleteProps } from '@mui/material'
import { Typography, BoxProps } from '@mui/material'
import { CommonInputFieldProps } from './types'
import { GenericOptionsType } from '../table/types'

const requiredFieldText = 'This field is required'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const paperProps = {
  sx: {
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    width: 250,
  },
}
export type CMultiAutocompleteProps = AutocompleteProps<
  (string | number | boolean)[],
  true,
  false,
  false,
  typeof Chip
>

export type MultiAutocompleteProps = CommonInputFieldProps &
  Omit<
    CMultiAutocompleteProps,
    'defaultValue' | 'value' | 'onChange' | 'options' | 'renderInput'
  > & {
    value?: (string | number | boolean)[]
    options?: {
      value: string | number | boolean
      label: ReactNode
      textLabel: string
    }[]
    disableHelperText?: boolean
    disableLabel?: boolean
    labelSx?: BoxProps['sx']
    ContainerProps?: FormControlProps
    onChange?: (
      newValue: (string | number | boolean)[],
      e: ChangeEvent<HTMLInputElement>
    ) => void
    // onChange?:
    //   | ((newValue: string[], e: SpecificSelectChangeEvent) => void)
    //   | ((newValue: number[], e: SpecificSelectChangeEvent) => void)
    //   | ((newValue: boolean[], e: SpecificSelectChangeEvent) => void)
    defaultValue?: (string | number | boolean)[]
    renderInput?: CMultiAutocompleteProps['renderInput']
  }

export const MultiAutocomplete = (props: MultiAutocompleteProps) => {
  const {
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
    (
      e: ChangeEvent<HTMLInputElement>,
      newValue: Exclude<GenericOptionsType, string[]>[]
    ) => {
      const newValueAdj = newValue.map((val) => val?.value ?? val)
      onChange?.(newValueAdj, e)
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

  const selectProps: CMultiAutocompleteProps = useMemo(() => {
    return {
      ...rest,
      multiple: true,
      value: (value ?? '') as unknown as CMultiAutocompleteProps['value'],
      onChange: handleChange as unknown as CMultiAutocompleteProps['onChange'],
      size: 'small',
      disabled,
      renderTags: (
        value: (string | number | boolean)[][],
        getTagProps: (params: { index: number }) => ChipProps
      ) => {
        return value.map((option: unknown, index: number) => {
          const { key, ...tagProps } = getTagProps({ index })

          return (
            <Tooltip
              title={options?.find((opt) => opt.value === option)?.label}
              disableInteractive
              key={index}
            >
              <Chip
                key={key}
                variant="outlined"
                label={options?.find((opt) => opt.value === option)?.label}
                size="small"
                {...tagProps}
              />
            </Tooltip>
          )
        })
      },
      sx: {
        // height: 42,
        // pt: !disableTopPadding ? 1 : 0,
        width: '100%',
        ...(props?.sx ?? {}),
      },

      renderInput: (params: TextFieldProps) => (
        <TextField
          {...params}
          variant="outlined"
          error={!!error}
          inputProps={{
            title: name,
            name: name,
            placeholder: placeholder,
            ...(params?.inputProps ?? {}),
          }}
        />
      ),
      options: (options as unknown as CMultiAutocompleteProps['options']) ?? [],
      // MenuProps,
      slotProps: {
        paper: paperProps,
        ...props?.slotProps,
      },
      defaultValue:
        props?.defaultValue as CMultiAutocompleteProps['defaultValue'],
    }
  }, [
    name,
    value,
    disabled,
    error,
    handleChange,
    options,
    placeholder,
    props.sx,
    rest,
    props?.defaultValue,
    props?.slotProps,
  ])

  return (
    <FormControl {...ContainerProps}>
      {!disableLabel && labelNode}
      <Autocomplete
        {...selectProps}
        disableClearable={true as false}
      ></Autocomplete>
      {!disableHelperText && (
        <FormHelperText {...helperTextProps}>
          {helperText ?? (error ? requiredFieldText : ' ')}
        </FormHelperText>
      )}
    </FormControl>
  )
}
