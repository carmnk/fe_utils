import { CAutoComplete, CAutoCompleteProps } from './AutoComplete'
import { MultiSelect, MultiSelectProps } from './MultiSelect'
import { CNumberFieldProps, NumberField } from './NumberField'
import { CSelectProps, Select } from './Select'
import { TextField, CTextFieldProps } from './TextField'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TextArea, TextAreaProps } from './TextArea'
import { Checkbox, CheckboxProps } from './Checkbox'
import { CommonInputFieldProps, InputFieldType } from './types'
import { Switch } from './Switch'
import { InputFieldProps } from './types'
import { useMemo } from 'react'

export type GenericInputFieldOption = {
  label: string
  value: number | string | boolean
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
                  : never

export type SimpleGenericInputFieldProps<T extends InputFieldType> =
  InputFieldProps<T> &
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
      hidden?: boolean
      invisible?: boolean
      disableHelperTextTheming?: boolean
      files?: T extends 'file'
        ? { [key: string]: { file: File; filename: string }[] }
        : never
      onFileChange?: (name: string, files: File[]) => void
    }

export type GenericInputFieldProps<T extends InputFieldType> =
  SimpleGenericInputFieldProps<T> & {
    options?: GenericInputFieldOption[]
  }

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
  props: GenericInputFieldProps<FieldType>
) => {
  const {
    value,
    label,
    name,
    placeholder,
    required,
    type,
    sx,
    options,
    hidden,
    invisible,
    error,
    ...rest
  } = props

  const sxAdj = useMemo(() => {
    if (invisible) return { display: 'none', ...sx }
    return sx
  }, [invisible, sx])

  return hidden ? null : type === 'text' ? (
    <TextField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<InputFieldProps<'text'>, 'name' | 'value' | 'color'>)}
    />
  ) : type === 'number' ? (
    <NumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<SpecificInputProps<'number'>, 'name'>)}
    />
  ) : type === 'int' ? (
    <NumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<SpecificInputProps<'int'>, 'name'>)}
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
      value={value as any}
      name={name}
      required={required}
      error={error}
      sx={sxAdj}
      {...(rest as Omit<SpecificInputProps<'bool'>, 'name' | 'value'>)}
    />
  ) : type === 'switch' ? (
    <Switch
      label={label}
      value={value as any}
      name={name}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as any)}
    />
  ) : type === 'date' ? (
    <DatePicker
      label={label}
      value={value as any}
      name={name}
      required={required}
      placeholder={placeholder}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<SpecificInputProps<'date'>, 'name'>)}
    />
  ) : type === 'textarea' ? (
    <TextArea
      label={label}
      value={value as string}
      name={name}
      placeholder={placeholder}
      required={required}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<SpecificInputProps<'textarea'>, 'name' | 'value'>)}
    />
  ) : type === 'select' ? (
    <Select
      label={label}
      value={value}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      sx={sxAdj}
      error={error}
      {...(rest as any)}
    />
  ) : type === 'autocomplete' ? (
    <CAutoComplete
      label={label}
      value={(value as any) ?? ''}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      sx={sxAdj}
      error={error}
      {...(rest as Omit<
        SpecificInputProps<'autocomplete'>,
        'name' | 'value' | 'options'
      >)}
    />
  ) : //  : type === 'multiselect' ? (
  //   <MultiSelect label={label} value={value} name={name} placeholder={placeholder} required={required} />
  // )
  null
}
