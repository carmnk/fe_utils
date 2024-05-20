import {
  ReactNode,
  ChangeEvent,
  SyntheticEvent,
  useState,
  useRef,
  forwardRef,
  ForwardedRef,
} from 'react'
import { FocusEvent, KeyboardEvent, useEffect } from 'react'
import { useMemo } from 'react'
import { Autocomplete, TextFieldProps, useTheme } from '@mui/material'
// import { FormHelperText, Typography } from '@mui/material'
import { FormControlProps, AutocompleteProps, Box } from '@mui/material'
import { GenericInputFieldProps } from './types'
import TextField, { CTextFieldProps } from './TextField'

const requiredFieldText = 'This field is required'

export type CustomAutocompleteProps = {
  // onChange?: (newValue: string, e: ChangeEvent<HTMLInputElement>) => void
  onInputChange?: (newValue: string, e: SyntheticEvent<Element, Event>) => void
  loading?: boolean
  // freeSolo?: boolean
  // disableHelperText?: boolean
  // disableLabel?: boolean
  options: { value: string; label: string }[]
  onKeyUp?: (e?: KeyboardEvent<HTMLInputElement>) => void
  value: string
  renderInput?: AutocompleteProps<string, false, false, boolean>['renderInput']
  slotProps?: AutocompleteProps<string, false, false, boolean>['slotProps'] &
    CTextFieldProps['slotProps'] & {
      // textfield?: CTextFieldProps
    }
}

export type SpecificMuiAutoCompleteProps = Omit<
  AutocompleteProps<string, false, false, boolean>,
  keyof CTextFieldProps | keyof CustomAutocompleteProps
>

export type SpecificMuiTextFieldProps = Omit<
  CTextFieldProps,
  ('autoComplete' | 'defaultValue') | keyof CustomAutocompleteProps
>

export type CAutoCompleteProps = GenericInputFieldProps<'autocomplete'> &
  SpecificMuiTextFieldProps &
  SpecificMuiAutoCompleteProps &
  CustomAutocompleteProps

const injectFieldNameToEvent = (
  e: SyntheticEvent<HTMLInputElement, HTMLInputElement>,
  name: string
): ChangeEvent<HTMLInputElement> =>
  ({
    ...(e ?? {}),
    target: { ...(e?.target ?? {}), name },
  }) as unknown as ChangeEvent<HTMLInputElement>

// const formHelperTextStyles = { ml: '2px', color: 'error.main' }

export const CAutoComplete = forwardRef(
  (props: CAutoCompleteProps, ref: ForwardedRef<any>) => {
    const {
      onChange,
      onInputChange,
      freeSolo = true,
      name,
      options = [],
      value = '',
      slotProps,
      ...restProps
    } = props

    const initValue =
      options?.find?.((opt) => opt?.value === value)?.label || ''
    const [inputValue, setInputValue] = useState(initValue ?? '')
    const theme = useTheme()
    const isFocussed = useRef(false)
    const isChanging = useRef(false)

    // const themeErrorText = useMemo(() => {
    //   return {
    //     color: theme.palette.error.main,
    //     fontWeight: 700,
    //   }
    // }, [theme.palette.error.main])

    // const formControlProps = useMemo(() => {
    //   return {
    //     ...(rootContainer ?? {}),
    //     sx: { width: '100%', minWidth: 240, ...(rootContainer?.sx ?? {}) },
    //   }
    // }, [rootContainer])

    // const labelTypographyProps: TypographyProps = useMemo(() => {
    //   return {
    //     variant: 'caption',
    //     style: error ? { color: theme.palette.error.main } : undefined,
    //     paddingBottom: '4px',
    //     ...labelProps,
    //   }
    // }, [error, theme, labelProps])

    const autoCompleteProps: AutocompleteProps<string, false, false, boolean> =
      useMemo(() => {
        const {
          clearIndicator,
          paper,
          popper,
          popupIndicator,
          // textfieldprops but will be partly used/overridden by autocomplete
          input,
          notchedInputLabel,
          inputContainer,
          ...muiTextFieldSlotProps // autocomplete slotProps
        } = slotProps ?? {}

        const muiAutoSelectSlotProps = {
          clearIndicator,
          paper,
          popper,
          popupIndicator,
        }

        const handleBlur = (
          e: FocusEvent<HTMLInputElement> &
            SyntheticEvent<HTMLInputElement, HTMLInputElement>
        ) => {
          isFocussed.current = false
          // if (!freeSolo) return
          const option = options?.find(
            (opt) => opt?.label === inputValue
          )?.value
          const valueAdj = option ?? (freeSolo ? inputValue : '')
          const event = name ? injectFieldNameToEvent(e, name) : (e as any)
          onChange?.(valueAdj, event)
          if (!freeSolo && !option) setInputValue('')
        }
        const onEnter = (
          e: KeyboardEvent<HTMLInputElement> &
            SyntheticEvent<HTMLInputElement, HTMLInputElement>
        ) => {
          if (e?.key === 'Enter' && !isChanging.current) {
            const option = options?.find(
              (opt) => opt?.label === inputValue
            )?.value
            const valueAdj = option ?? (freeSolo ? inputValue : '')
            const event = name ? injectFieldNameToEvent(e, name) : (e as any)
            onChange?.(valueAdj, event)
          }
        }
        const handleFocus = () => {
          isFocussed.current = true
        }
        const handleChange = ((
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
        }) as any

        const handleInputChange = (
          e: SyntheticEvent<Element, Event>,
          newValue: string
        ) => {
          if (e?.type === 'keydown' || e?.type !== 'change') return
          setInputValue(newValue)
          onInputChange?.(newValue ?? '', e)
        }
        return {
          options: options as any,
          noOptionsText:
            'no optionen available' +
            (inputValue ? ` for "${inputValue}"` : ''),

          renderInput: (params: TextFieldProps) => {
            const onChange = (newValue: string, event?: any, name?: string) => {
              const eventValue = {
                target: {
                  value: newValue,
                },
              }
              params?.onChange?.(eventValue as any)
            }
            console.warn('params', restProps, params)
            return (
              <TextField
                {...params}
                rows={params?.rows as any}
                value={params?.value as string}
                onChange={onChange}
                onKeyUp={params?.onKeyUp as any}
                name={name}
                slotProps={{
                  ...muiTextFieldSlotProps,
                  input: {
                    ...(params?.inputProps ?? {}),
                    ...(input ?? {}),
                  },
                  inputContainer: {
                    ...params?.InputProps,
                    ...inputContainer,
                  },
                  notchedInputLabel: {
                    ...params?.InputLabelProps,
                    ...notchedInputLabel,
                  },
                }}
                // disableHelperText
                // // disableLabel={!useNotchedLabel}
                // useNotchedLabel={useNotchedLabel}
                // label={label}
                {...restProps}
                ref={ref}
              />
            )
          },
          size: 'small',
          renderOption: (props: any, option: any) => (
            <Box fontSize={14} component="li" {...props}>
              {option?.label}
            </Box>
          ),
          ...restProps,
          slotProps: {
            ...muiAutoSelectSlotProps,
            popper: {
              ...(muiAutoSelectSlotProps.popper ?? {}),
              sx: {
                zIndex: 999999,
                ...(muiAutoSelectSlotProps?.popper?.sx ?? {}),
              },
            },
          },
          sx: {
            // height: 42,
            // p: 0,
            width: '100%',
            fontSize: 14,
            lineHeight: '16px',
            color: theme.palette.text.primary,
            ...((restProps as any)?.sx ?? {}),
          },
          freeSolo,
          onFocus: handleFocus,
          onChange: handleChange,
          inputValue,
          value: inputValue,
          onInputChange: handleInputChange,
          onBlur: handleBlur,
          onKeyUp: restProps?.onKeyUp || onEnter,
        }
      }, [
        inputValue,
        onChange,
        onInputChange,
        options,
        restProps,
        freeSolo,
        theme,
        name,
        // label,
        slotProps,
        ref,
      ])

    // update inner inputValue when outer value is changed
    useEffect(() => {
      // try to map with options
      const initValue =
        options?.find?.((opt) => opt?.value === value)?.label ||
        (freeSolo ? value : '')
      setInputValue(initValue)
      isChanging.current = true
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
      // try to map with options
      if (!options?.length || isFocussed.current) return
      const initValue =
        options?.find((opt) => opt?.value === value)?.label ||
        (freeSolo ? value : '')
      setInputValue(initValue)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options])

    useEffect(() => {
      isChanging.current = false
    }, [inputValue])

    return (
      // <FormControl {...formControlProps}>
      //   {!disableLabel && !useNotchedLabel && (
      //     <Typography {...labelTypographyProps}>
      //       {label}
      //       {required && <strong style={themeErrorText}> *</strong>}
      //     </Typography>
      //   )}

      <Autocomplete<string, false, false, boolean> {...autoCompleteProps} />
      //   {/* {!disableHelperText && (
      //     <FormHelperText sx={formHelperTextStyles} {...formHelperTextProps}>
      //       {helperText ? helperText : error ? requiredFieldText : ' '}
      //     </FormHelperText>
      //   )}
      // </FormControl>*/}
    )
  }
)
CAutoComplete.displayName = 'CAutoComplete'
