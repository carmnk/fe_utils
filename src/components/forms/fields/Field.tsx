import { ChangeEvent, useCallback } from 'react'
import {
  GenericInputField,
  GenericInputFieldProps,
} from '../../inputs/GenericInputField'
import { CustomField, CustomFieldDefinition } from './CustomField'
import moment from 'moment'
import { InputFieldType } from '../../inputs/types'

export type FormFieldType =
  | InputFieldType
  | 'inject'
  | 'array'
  | 'object'
  | 'string-array'

type InputFieldLayoutProps = {
  width12?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  fillWidth?: boolean
}
type ArrayInputFieldProps = {
  type: 'array'
  name: string
  enableDeleteFirst?: boolean
}
type ObjectInputFieldProps = {
  type: 'object'
  name: string
}

type StringArrayInputFieldProps = {
  type: 'string-array'
  name: string
  label: string
  enableDeleteFirst?: boolean
}

export type StaticFieldDefinition<Type extends FormFieldType = FormFieldType> =
  InputFieldLayoutProps & { type: Type } & (Type extends 'inject'
      ? CustomFieldDefinition<any, any>
      : Type extends InputFieldType
        ? Omit<GenericInputFieldProps<Type>, 'name'> & { name: string } // make required
        : Type extends 'array'
          ? ArrayInputFieldProps
          : Type extends 'object'
            ? ObjectInputFieldProps
            : Type extends 'string-array'
              ? StringArrayInputFieldProps
              : never)

export type DynamicFieldDefinition<Type extends FormFieldType = FormFieldType> =
  Omit<
    StaticFieldDefinition<Type>,
    | 'disabled'
    | 'required'
    | 'options'
    | 'error'
    | 'helperText'
    | 'invisible'
    | 'hidden'
  > & {
    disabled?: boolean | ((formData: any, rootFormData: any) => boolean)
    required?: boolean | ((formData: any, rootFormData: any) => boolean)
    options?: any[] | ((formData: any, rootFormData: any) => any[])
    error?: boolean | ((formData: any, rootFormData: any) => boolean)
    helperText?: string | ((formData: any, rootFormData: any) => string)
    invisible?: boolean | ((formData: any, rootFormData: any) => boolean)
    hidden?: boolean | ((formData: any, rootFormData: any) => boolean)
  }

// | ArrayInputFieldProps
// | ObjectInputFieldProps
// | StringArrayInputFieldProps

export type FieldProps = {
  formData: any
  onChangeFormData: any // (value: any) => void
  rootFormData: any
  onChangeFormDataRoot: any // (value: any) => void
  _path: any
  onBeforeChange?: any //(value: any) => any
  showError?: boolean
  // type: string
  field: DynamicFieldDefinition<InputFieldType | 'inject'> // -> make gneric! StaticFieldType
  files?: any
  onFileChange?: any
}

export const Field = (props: FieldProps) => {
  const {
    onFileChange,
    files,
    formData,
    onChangeFormData,
    onBeforeChange,
    showError,
    rootFormData,
    onChangeFormDataRoot,
    field,
    _path,
  } = props as FieldProps

  const handleChange = useCallback(
    (newValue: string, e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e?.target ?? {}
      console.log('handleChange', name, value)
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }
      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )
  const handleCheckbox = useCallback(
    (e: ChangeEvent<HTMLInputElement>, value: any) => {
      const { name } = e?.target ?? {}
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }

      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )

  const handleChangeDate = useCallback(
    (newvalue: string, name: string) => {
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: newvalue },
        formData,
        name,
        newvalue
      ) ?? {
        ...formData,
        [name]: moment(newvalue).format('YYYY-MM-DD'),
      }
      onChangeFormData(newValueWithInjections, name, newvalue, formData)
    },
    [formData, onChangeFormData, onBeforeChange]
  )

  const handleChangeSelect = useCallback(
    (value: string, e: ChangeEvent<HTMLInputElement>) => {
      const name = e?.target?.name
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: value },
        formData,
        name,
        value
      ) ?? {
        ...formData,
        [name]: value,
      }
      onChangeFormData(newValueWithInjections, name, value, formData)
    },
    [onBeforeChange, formData, onChangeFormData]
  )
  const injectIsInt = field.type === 'int' ? { isInt: true } : {}

  // const FieldComponent = (field as any)?.component
  const fieldOptions =
    typeof field?.options === 'function'
      ? field?.options(formData, rootFormData)
      : field?.options
  const fieldError =
    typeof field?.error === 'function'
      ? field?.error(formData, rootFormData)
      : field?.error
  const fieldRequired =
    typeof field?.required === 'function'
      ? field?.required(formData, rootFormData)
      : field?.required
  const fieldValue = formData?.[field?.name ?? '']

  return field.type === 'inject' ? (
    <CustomField
      formData={formData}
      onChangeFormData={onChangeFormData}
      params={(field as CustomFieldDefinition<FormData, any>).params}
      rootFormData={rootFormData}
      onChangeFormDataRoot={onChangeFormDataRoot}
      _path={_path}
      onBeforeChange={onBeforeChange as any}
      // showError={showError}
      field={field as any}
      onFileChange={onFileChange}
      files={files}
    />
  ) : ['array', 'object', 'string-array'].includes(field.type) ? null : (
    <GenericInputField
      {...field}
      options={fieldOptions}
      error={
        fieldError ??
        (showError &&
          fieldRequired &&
          ((['textarea', 'text', 'select', 'autocomplete', 'dropdown'].includes(
            field?.type
          ) &&
            !fieldValue &&
            fieldValue !== false) ||
            (['number', 'int'].includes(field?.type) &&
              typeof fieldValue !== 'number') ||
            (['date'].includes(field?.type) && !fieldValue)))
      }
      sx={{
        border: '1px solid rgb(221, 226, 234)',
        display: field?.hidden ? 'none' : undefined,
      }}
      {...(injectIsInt as any)}
      value={formData?.[field?.name ?? ''] ?? ''}
      onChange={
        ['select', 'autocomplete', 'dropdown'].includes(field.type)
          ? (handleChangeSelect as any)
          : field.type === 'date'
            ? handleChangeDate
            : field.type === 'bool'
              ? handleCheckbox
              : handleChange
      }
      // onFileChange={onFileChange}
      // files={files}
    />
  )
}
