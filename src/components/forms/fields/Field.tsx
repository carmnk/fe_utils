import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { GenericInputField } from '../../inputs/GenericInputField'
import { CustomField, CustomFieldDefinition } from './CustomField'
import { GenericInputFieldProps, InputFieldType } from '../../inputs/types'
import { FormDataType } from '../types'

export type FormFieldType =
  | InputFieldType
  | 'inject'
  | 'array'
  | 'object'
  | 'string-array'

type Width12 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type InputFieldLayoutProps = {
  width12?:
    | Width12
    | { xs: Width12; sm?: Width12; md?: Width12; lg?: Width12; xl?: Width12 }
  fillWidth?: boolean
  _prop_type?: string
  form?: {
    defaultValue?: unknown
    showInArrayList?: boolean
  }
}
type ArrayInputFieldProps = {
  type: 'array'
  name: string
  enableDeleteFirst?: boolean
  form?: {
    defaultValue?: unknown
    showInArrayList?: boolean
  }
  label?: string
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
        ? Omit<GenericInputFieldProps<Type>, 'name' | 'value' | 'onChange'> & {
            name: string
          } // make required
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
    disabled?:
      | boolean
      | ((formData: FormDataType, rootFormData: FormDataType) => boolean)
    required?:
      | boolean
      | ((formData: FormDataType, rootFormData: FormDataType) => boolean)
    options?:
      | any[]
      | ((formData: FormDataType, rootFormData: FormDataType) => any[])
    error?:
      | boolean
      | ((formData: FormDataType, rootFormData: FormDataType) => boolean)
    helperText?:
      | ReactNode
      | ((formData: FormDataType, rootFormData: FormDataType) => ReactNode)
    invisible?:
      | boolean
      | ((formData: FormDataType, rootFormData: FormDataType) => boolean)
    hidden?:
      | boolean
      | ((formData: FormDataType, rootFormData: FormDataType) => boolean)
  }

// | ArrayInputFieldProps
// | ObjectInputFieldProps
// | StringArrayInputFieldProps

export type FieldProps = {
  formData: FormDataType
  onChangeFormData: any // (value: any) => void
  rootFormData: FormDataType
  onChangeFormDataRoot: any // (value: any) => void
  _path: (string | number)[]
  onBeforeChange?: any //(value: any) => any
  showError?: boolean
  // type: string
  field: DynamicFieldDefinition<InputFieldType | 'inject'> // -> make gneric! StaticFieldType
  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: any
  fieldProps?: Partial<GenericInputFieldProps>
  useChangeCompleted?: boolean
  fields: any
  subforms: any
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
    fieldProps,
    useChangeCompleted,
    fields,
    subforms,
  } = props as FieldProps

  const [innerValue, setInnerValue] = useState<
    string | number | boolean | null
  >(formData?.[field?.name ?? ''] ?? (field as any)?.form?.defaultValue ?? '')
  const handleChangeInnerValue = useCallback(
    (newValue: string | number | boolean | null) => {
      setInnerValue(newValue)
    },
    []
  )
  useEffect(() => {
    setInnerValue(
      (formData?.[field?.name ?? ''] as string | number | boolean | null) ?? ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.[field?.name ?? '']])

  const handleChange = useCallback(
    (newValue: string, e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e?.target ?? {}
      const newValueAdj = useChangeCompleted ? innerValue : newValue
      const newValueWithInjections = onBeforeChange?.(
        { ...formData, [name]: newValueAdj },
        formData,
        name,
        newValueAdj
      ) ?? {
        ...formData,
        [name]: newValueAdj,
      }
      onChangeFormData(
        newValueWithInjections,
        name,
        newValueWithInjections?.[name] ?? newValueAdj,
        formData
      )
    },
    [onBeforeChange, formData, onChangeFormData, innerValue, useChangeCompleted]
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
      params={
        (field as CustomFieldDefinition<FormData, { [key: string]: any }>)
          .params
      }
      rootFormData={rootFormData}
      onChangeFormDataRoot={onChangeFormDataRoot}
      _path={_path}
      onBeforeChange={onBeforeChange}
      // showError={showError}
      field={field as any}
      onFileChange={onFileChange}
      files={files}
      fields={fields}
      subforms={subforms}
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
        // border: '1px solid rgb(221, 226, 234)',
        display: field?.hidden ? 'none' : undefined,
      }}
      {...(injectIsInt as any)}
      value={
        useChangeCompleted
          ? innerValue
          : (formData?.[field?.name ?? ''] ?? field?.form?.defaultValue ?? '')
      }
      onChange={
        useChangeCompleted &&
        [
          'text',
          'number',
          'date',
          'time',
          'select',
          'autocomplete',
          'textarea',
          'number',
          'int',
        ].includes(field.type)
          ? handleChangeInnerValue
          : handleChange
      }
      onChangeCompleted={
        useChangeCompleted &&
        [
          'text',
          'number',
          'date',
          'time',
          'select',
          'autocomplete',
          'textarea',
          'number',
          'int',
        ].includes(field.type)
          ? (e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, e)
          : undefined
      }
      onKeyDown={
        useChangeCompleted
          ? (e: ChangeEvent<HTMLInputElement> & { key: string }) => {
              if (e.key === 'Enter') {
                handleChange(e.target.value, e)
              }
            }
          : undefined
      }
      {...fieldProps}
      // onFileChange={onFileChange}
      // files={files}
    />
  )
}
