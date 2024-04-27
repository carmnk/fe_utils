import { CAutoComplete, CAutoCompleteProps } from './AutoComplete'
import { MultiSelect, MultiSelectProps } from './MultiSelect'
import { CNumberFieldProps, NumberField } from './NumberField'
import { CSelectProps, Select } from './Select'
import { TextField, TextFieldProps } from './TextField'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TextArea, TextAreaProps } from './TextArea'
import { Checkbox, CheckboxProps } from './Checkbox'
import { CommonInputFieldProps } from './_types'
import { Switch } from './Switch'

export type GenericInputFieldType =
  | 'text'
  | 'number'
  | 'int'
  | 'date'
  | 'select'
  | 'autocomplete'
  | 'multiselect'
  | 'textarea'
  | 'bool'
  | 'switch'
  | 'file'

export type GenericInputFieldOption = {
  label: string
  value: number | string | boolean
}

export type SpecificInputProps<T extends GenericInputFieldType> =
  T extends 'text'
    ? TextFieldProps
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

export type SimpleGenericInputFieldProps<T extends GenericInputFieldType> =
  CommonInputFieldProps &
    SpecificInputProps<T> & {
      type: T
      value?: T extends 'text' | 'textarea'
        ? string | null
        : T extends 'number' | 'int'
          ? number | '' | null
          : T extends 'date'
            ? string | null
            : T extends 'file'
              ? number | '' | null
              : null
      onChange?: (newValue: any, e?: any) => void
      hidden?: boolean
      invisible?: boolean
      disableHelperTextTheming?: boolean
      files?: T extends 'file'
        ? { [key: string]: { file: File; filename: string }[] }
        : never
      onFileChange?: (name: string, files: File[]) => void
    }

export type GenericInputFieldProps<T extends GenericInputFieldType> =
  SimpleGenericInputFieldProps<T> & {
    options?: GenericInputFieldOption[]
  }

/**
 * Generic Input Field Component - provides a unified prop interface for different input types.
 * The type property {@link GenericInputFieldType} determines the rendered input type
 * Prefer using the GenericForm Component directly
 * @param props: {@link GenericInputFieldProps}
 * @returns JSX.Element | null
 * @todo implement Multiselect Component
 */
export const GenericInputField = (
  props: GenericInputFieldProps<GenericInputFieldType>
) => {
  const {
    value,
    label,
    name,
    placeholder,
    required,
    maxLength,
    type,
    sx,
    options,
    hidden,
    invisible,
    error,
    files,
    ...restIn
  } = props
  const rest = { ...restIn }

  return hidden ? null : type === 'text' ? (
    <TextField
      label={label}
      value={value}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{
        sx: { ...(sx ?? {}), visibility: !invisible ? 'visible' : 'hidden' },
      }}
      error={error}
      {...(restIn as Omit<SpecificInputProps<'text'>, 'name'>)}
    />
  ) : type === 'number' ? (
    <NumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{ sx }}
      error={error}
      {...(restIn as Omit<SpecificInputProps<'number'>, 'name'>)}
    />
  ) : type === 'int' ? (
    <NumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{ sx }}
      error={error}
      {...(restIn as Omit<SpecificInputProps<'int'>, 'name'>)}
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
      {...(restIn as Omit<SpecificInputProps<'bool'>, 'name'>)}
    />
  ) : type === 'switch' ? (
    <Switch
      label={label}
      value={value as any}
      name={name}
      required={required}
      {...(restIn as any)}
    />
  ) : type === 'date' ? (
    <DatePicker
      label={label}
      value={value as any}
      name={name}
      required={required}
      {...(restIn as Omit<SpecificInputProps<'date'>, 'name'>)}
    />
  ) : type === 'textarea' ? (
    <TextArea
      label={label}
      value={value as string}
      name={name}
      placeholder={placeholder}
      required={required}
      {...(restIn as Omit<SpecificInputProps<'textarea'>, 'name' | 'value'>)}
    />
  ) : type === 'select' ? (
    <Select
      label={label}
      value={value}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      error={error}
      {...(rest as Omit<SpecificInputProps<'select'>, 'name'>)}
    />
  ) : type === 'autocomplete' ? (
    <CAutoComplete
      label={label}
      value={(value as any) ?? ''}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      error={error}
      {...(restIn as Omit<
        SpecificInputProps<'autocomplete'>,
        'name' | 'value' | 'options'
      >)}
    />
  ) : //  : type === 'multiselect' ? (
  //   <MultiSelect label={label} value={value} name={name} placeholder={placeholder} required={required} />
  // )
  null
}
