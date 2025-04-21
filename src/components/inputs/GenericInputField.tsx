import {
  CAutoComplete,
  CAutoCompleteProps,
  DefaultGenericValueType,
} from './AutoComplete'
import { MultiSelect, MultiSelectProps } from './MultiSelect'
import { CNumberFieldProps, NumberField } from './NumberField'
import { CSelectProps } from './Select'
import { CTextField, CTextFieldProps } from './TextField'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TextAreaProps } from './_archiv/TextArea'
import { Checkbox, CheckboxProps } from './Checkbox'
import { InputFieldType } from './types'
import { Switch } from './Switch'
import { GenericInputFieldProps } from './types'
import { KeyboardEvent, KeyboardEventHandler, useMemo } from 'react'
import { CSelect2 } from './Select2'
import { CTimeField, CTimeFieldProps } from './TimeField'
import { JsonField, JsonFieldProps } from './JsonField'
import { Moment } from 'moment'

export type GenericInputFieldOption = {
  label: string
  value: number | string | boolean
}

export type StringValueOption = {
  label: string
  value: string
  textLabel?: string
}

export type SpecificInputProps<T extends InputFieldType> = T extends 'text'
  ? CTextFieldProps
  : T extends 'number'
    ? CNumberFieldProps
    : T extends 'int'
      ? CNumberFieldProps
      : T extends 'date'
        ? DatePickerProps
        : T extends 'select'
          ? CSelectProps
          : T extends 'multiselect'
            ? MultiSelectProps
            : T extends 'autocomplete'
              ? CAutoCompleteProps
              : T extends 'textarea'
                ? TextAreaProps
                : T extends 'bool'
                  ? CheckboxProps
                  : T extends 'json'
                    ? JsonFieldProps
                    : never

export type GGenericInputFieldProps<T extends InputFieldType> =
  GenericInputFieldProps<T> &
    Omit<SpecificInputProps<T>, 'value' | 'onChange'> & {
      type: T
      // value?: T extends 'text' | 'textarea'
      //   ? string | null
      //   : T extends 'number' | 'int'
      //     ? number | '' | null
      //     : T extends 'date'
      //       ? string | null
      //       : T extends 'select' | 'autocomplete'
      //         ? number | string | boolean | null
      //         : T extends 'bool' | 'switch'
      //           ? boolean | null
      //           : null
      // onChange?: (newValue: any, e?: any) => void
      // options?: any[]
      hidden?: boolean
      invisible?: boolean
      disableHelperTextTheming?: boolean
      files?: T extends 'file'
        ? { [key: string]: { file: File; filename: string }[] }
        : never
      onFileChange?: (name: string, files: File[]) => void
      onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
      onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void
    }

// export type GenericInputFieldProps<T extends InputFieldType> =
//   SimpleGenericInputFieldProps<T> & {
//     options?: GenericInputFieldOption[]
//   }

/**
 * Generic Input Field Component - provides a unified prop interface for different input types.
 * The type property {@link InputFieldType} determines the rendered input type
 * Prefer using the GenericForm Component directly
 * @param props: {@link GenericInputFieldProps}
 * @returns JSX.Element | null
 * @todo implement Multiselect Component
 */
export const GenericInputField = <
  FieldType extends InputFieldType = InputFieldType,
>(
  props: GGenericInputFieldProps<FieldType>
) => {
  const {
    value,
    label,
    name,
    required,
    type,
    sx,
    hidden,
    invisible,
    error,
    ...rest
  } = props

  const {
    enableVirtualization: _eOut,
    keysDict: _kOut,
    ...restSelect
  } = rest as typeof rest & { enableVirtualization: boolean; keysDict: unknown }

  const options = 'options' in props ? props.options : undefined

  const sxAdj = useMemo(() => {
    if (invisible) return { display: 'none', ...sx }
    return sx
  }, [invisible, sx])

  const multiSelectContainerProps = useMemo(() => {
    return {
      ...(
        rest as unknown as {
          ContainerProps: MultiSelectProps['ContainerProps']
        }
      )?.ContainerProps,
      sx: {
        width: '100%',
        ...((
          rest as unknown as {
            ContainerProps: MultiSelectProps['ContainerProps']
          }
        )?.ContainerProps?.sx ?? {}),
      },
    }
  }, [rest])

  const multiSelectValue = useMemo(() => {
    return value
      ? typeof value === 'string' &&
        value.startsWith('[') &&
        value.endsWith(']')
        ? JSON.parse(value)
        : value
      : []
  }, [value])

  return hidden ? null : type === 'text' ? (
    <CTextField
      label={label}
      value={value as string}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<
        GenericInputFieldProps<'text'>,
        'name' | 'value' | 'color'
      >)}
    />
  ) : type === 'number' ? (
    <NumberField
      label={label}
      value={value as number}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...rest}
      onChange={rest.onChange as CNumberFieldProps['onChange']}
      color={rest?.color === 'default' ? undefined : rest?.color}
    />
  ) : type === 'int' ? (
    <NumberField
      label={label}
      value={value as number}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      isInt
      {...rest}
      onChange={rest.onChange as CNumberFieldProps['onChange']}
      color={rest?.color === 'default' ? undefined : rest?.color}
    />
  ) : type === 'json' ? (
    // <NumberField
    //   label={label}
    //   value={value as any}
    //   name={name}
    //   required={required}
    //   sx={sxAdj}
    //   error={error}
    //   isInt
    //   {...(rest as any)}
    // />

    <JsonField
      value={value as unknown as Record<string, unknown>}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      label={label as string}
      {...rest}
      onChange={rest.onChange as JsonFieldProps['onChange']}
      fontSize={12}
    />
  ) : //
  // : type === 'file' ? (
  //   <FileUploader
  //     handleUpload={(file: any) => restIn?.onFileChange?.(name, file)}
  //     disableDelete={true}
  //     resetFile={() => {
  //       restIn?.onChange?.({ target: { value: 0, name: name } })
  //     }}
  //     files={(files?.[name] as any) ?? []}
  //     helperText="Upload file"
  //     inputId="file-id"
  //     label="Upload file Label"
  //     required={true}
  //     isLoading={false}
  //     accept="*"
  //     enableMultipleFiles={true}
  //     isError
  //     // handleReplaceFile={}
  //     {...restIn}
  //   />
  // )
  type === 'bool' ? (
    <Checkbox
      label={label}
      value={value as boolean}
      name={name}
      required={required}
      error={error}
      sx={sxAdj}
      {...rest}
      onKeyUp={
        rest.onKeyUp as unknown as KeyboardEventHandler<HTMLButtonElement>
      }
      onKeyDown={rest.onKeyDown as KeyboardEventHandler<HTMLButtonElement>}
      onChange={rest.onChange as CheckboxProps['onChange']}
    />
  ) : type === 'switch' ? (
    <Switch
      label={label}
      value={value as boolean}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...rest}
      onKeyUp={
        rest.onKeyUp as unknown as KeyboardEventHandler<HTMLButtonElement>
      }
      onKeyDown={rest.onKeyDown as KeyboardEventHandler<HTMLButtonElement>}
      color={rest?.color === 'default' ? undefined : rest?.color}
      onChange={rest.onChange as CheckboxProps['onChange']}
    />
  ) : type === 'date' ? (
    <DatePicker
      label={label}
      value={value as string}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...rest}
      color={rest?.color === 'default' ? undefined : rest?.color}
      onChange={rest.onChange as DatePickerProps['onChange']}
    />
  ) : type === 'time' ? (
    <CTimeField
      label={label}
      value={value as unknown as Moment & string}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      color={rest?.color === 'default' ? undefined : rest?.color}
      {...rest}
      onChange={rest.onChange as CTimeFieldProps['onChange']}
    />
  ) : type === 'textarea' ? (
    <CTextField
      label={label}
      value={value as string}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...rest}
      color={rest?.color === 'default' ? undefined : rest?.color}
      multiline
      onChange={rest.onChange as CTextFieldProps['onChange']}
    />
  ) : type === 'select' ? (
    <CSelect2
      label={label}
      value={value as string}
      name={name}
      required={required}
      options={(options as GenericInputFieldOption[]) ?? []}
      sx={sxAdj}
      error={error}
      {...restSelect}
      color={rest?.color === 'default' ? undefined : rest?.color}
      onChange={rest.onChange as CTextFieldProps['onChange']}
    />
  ) : type === 'autocomplete' ? (
    <CAutoComplete
      label={label}
      value={(value as string) ?? ''}
      name={name}
      required={required}
      options={(options as DefaultGenericValueType[]) ?? []}
      sx={sxAdj}
      error={error}
      {...rest}
      onKeyUp={rest.onKeyUp as KeyboardEventHandler<HTMLInputElement>}
      color={rest?.color === 'default' ? undefined : rest?.color}
      onChange={rest.onChange as CAutoCompleteProps['onChange']}
    />
  ) : type === 'multiselect' ? (
    <MultiSelect
      label={label}
      value={multiSelectValue}
      name={name}
      required={required}
      options={(options as StringValueOption[]) ?? []}
      sx={sxAdj}
      error={error}
      {...rest}
      color={rest?.color === 'default' ? undefined : rest?.color}
      ContainerProps={multiSelectContainerProps}
      onChange={rest.onChange as MultiSelectProps['onChange']}
    />
  ) : null
}
