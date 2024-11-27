import { forwardRef, ForwardedRef, SyntheticEvent, HTMLAttributes } from 'react'
import { ReactNode, ChangeEvent, useState, useRef } from 'react'
import { FocusEvent, KeyboardEvent, useEffect } from 'react'
import { useMemo } from 'react'
import { Autocomplete, InputAdornment, TextFieldProps } from '@mui/material'
import { AutocompleteProps, Box, useTheme } from '@mui/material'
import { GenericInputFieldProps } from './types'
import { CTextFieldProps, CTextField } from './TextField'
import { Icon } from '@mdi/react'
import { defaultInputContainerTextFieldStyles } from './defaultTextFieldStyles'
import { ListboxComponent } from './AutoCompleteVirtualization'

export type CustomAutocompleteProps = {
  // onChange?: (newValue: string, e: ChangeEvent<HTMLInputElement>) => void
  onInputChange?: (newValue: string, e: SyntheticEvent<Element, Event>) => void
  onChange?: (newValue: string, e: SyntheticEvent<Element, Event>) => void
  loading?: boolean
  // freeSolo?: boolean
  // disableHelperText?: boolean
  // disableLabel?: boolean
  options: { value: string; label: string }[]
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void
  value: string
  renderInput?: AutocompleteProps<string, false, false, boolean>['renderInput']
  slotProps?: AutocompleteProps<string, false, false, boolean>['slotProps'] &
    CTextFieldProps['slotProps'] & {
      // textfield?: CTextFieldProps
    }
  enableVirtualization?: boolean
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
  e: SyntheticEvent<Element, Event>,
  name: string
): ChangeEvent<HTMLInputElement> =>
  ({
    ...(e ?? {}),
    target: { ...(e?.target ?? {}), name },
  }) as unknown as ChangeEvent<HTMLInputElement>

export const CAutoComplete = forwardRef(
  (props: CAutoCompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      onChange,
      onInputChange,
      freeSolo = true,
      name,
      options = [],
      value = '',
      slotProps,
      startIcon,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      endIcon: _e,
      borderRadius,
      enableVirtualization,
      ...restProps
    } = props

    const initValue =
      options?.find?.((opt) => opt?.value === value)?.label || ''
    const [inputValue, setInputValue] = useState(initValue ?? '')
    const theme = useTheme()
    const isFocussed = useRef(false)
    const isChanging = useRef(false)

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
            SyntheticEvent<HTMLInputElement, Event>
        ) => {
          isFocussed.current = false
          // if (!freeSolo) return
          const option = options?.find(
            (opt) => opt?.label === inputValue
          )?.value
          const valueAdj = option ?? (freeSolo ? inputValue : '')
          const event = name ? injectFieldNameToEvent(e, name) : e
          onChange?.(valueAdj, event, name)
          if (!freeSolo && !option) setInputValue('')
        }
        const onEnter = (
          e: KeyboardEvent<HTMLInputElement> &
            SyntheticEvent<HTMLInputElement, KeyboardEvent>
        ) => {
          if (e?.key === 'Enter' && !isChanging.current) {
            const option = options?.find(
              (opt) => opt?.label === inputValue
            )?.value
            const valueAdj = option ?? (freeSolo ? inputValue : '')
            const event = name
              ? injectFieldNameToEvent(e, name)
              : (e as unknown as ChangeEvent<HTMLInputElement>)
            onChange?.(valueAdj, event)
          }
        }
        const handleFocus = () => {
          isFocussed.current = true
        }
        const handleChange = (
          e: SyntheticEvent<Element, Event>,
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
          const event = name ? injectFieldNameToEvent(e, name) : e
          onChange?.(value, event as any, name)
        }

        const handleInputChange = (
          e: SyntheticEvent<Element, Event>,
          newValue: string
        ) => {
          if (e?.type === 'keydown' || e?.type !== 'change') return
          setInputValue(newValue)
          onInputChange?.(newValue ?? '', e)
        }
        return {
          options: options as any[],
          noOptionsText:
            'no optionen available' +
            (inputValue ? ` for "${inputValue}"` : ''),

          renderInput: (params: TextFieldProps) => {
            const onChange = (newValue: string, event?: any, name?: string) => {
              const eventValue = {
                ...(event ?? {}),
                target: {
                  value: newValue,
                  name,
                  ...(event?.target ?? {}),
                },
              }
              params?.onChange?.(eventValue)
            }
            return (
              <CTextField
                {...params}
                rows={params?.rows as number}
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
                    sx: {
                      ...defaultInputContainerTextFieldStyles,
                      // height: props?.multiline ? undefined : 42,
                      borderRadius,
                      pl: '14px !important',
                      ...(inputContainer?.sx ?? {}),
                    },
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
          renderOption: enableVirtualization
            ? (props, option, state) =>
                [props, option, state.index] as ReactNode
            : (
                props: HTMLAttributes<HTMLLIElement> & { key: string },
                option: any
              ) => (
                <Box fontSize={14} component="li" {...props}>
                  {option?.label}
                </Box>
              ),
          // ...restProps,
          ListboxComponent: enableVirtualization ? ListboxComponent : undefined,
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
          disableListWrap: true,
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
        slotProps,
        ref,
        borderRadius,
        startIcon,
        enableVirtualization,
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
      <Autocomplete<string, false, false, boolean> {...autoCompleteProps} />
    )
  }
)
CAutoComplete.displayName = 'CAutoComplete'
