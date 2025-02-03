import { BoxProps, GridProps } from '@mui/material'
import { ReactNode } from 'react'
import { CButtonProps } from '../buttons'
import { GenericInputFieldProps } from '../inputs/types'
import { StaticFieldDefinition } from './fields'

export type FormDataType = Record<string, unknown>

export type GenericFormParams = Omit<
  GenericFormProps,
  'formData' | 'onChangeFormData'
>

type DynamicInjected<Type, FormdataType, RootFormDataType = FormDataType> =
  | Type
  | ((formData: FormdataType, rootFormData: RootFormDataType) => Type)

type DynamicInjectedDict<
  Type,
  FormDataType,
  RootFormDataType = FormDataType,
> = {
  [key: string]: DynamicInjected<Type, FormDataType, RootFormDataType>
}
type DynamicRootInjected<FormDataType> =
  | FormDataType
  | ((
      formData: FormDataType,
      rootFormData: FormDataType,
      arrayIdx: number
    ) => FormDataType)

export type GenericFormProps<F extends FormDataType = FormDataType> = {
  _path?: (string | number)[]
  _removeFormFromArray?: () => void
  fields: DynamicInjected<StaticFieldDefinition[], F> // StaticFieldDefinition[] | ((formData: F) => StaticFieldDefinition[])
  injections?: {
    initialFormData?: DynamicRootInjected<F>
    options?: DynamicInjectedDict<any[], F>
    disabled?: DynamicInjectedDict<boolean, F>
    hidden?: DynamicInjectedDict<boolean, F>
    invisible?: DynamicInjectedDict<boolean, F>
    required?: DynamicInjectedDict<boolean, F>
    error?: DynamicInjectedDict<boolean, F>
    helperText?: DynamicInjectedDict<boolean, F>
    keysDict?: DynamicInjectedDict<any, F>
    onBeforeChange?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      changedPropertyValue: unknown
    ) => F
    onBeforeRemoveArrayItem?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      deletedIndex: number
    ) => F
  }
  subforms?: {
    [key in keyof F as string]: Omit<
      GenericFormProps<F>,
      'formData' | 'onChangeFormData'
    >
  }
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: unknown,
    prevFormData: F,
    subformName?: string // better path?
  ) => void
  rootFormData?: FormDataType
  onChangeFormDataRoot?: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: unknown,
    prevFormData: F,
    subformName?: string // better path?
  ) => void

  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
  slotProps?: {
    formContainer?: BoxProps
    subformContainer?: BoxProps
    fieldsContainer?: Partial<GridProps>
    fieldContainer?: Partial<GridProps>
    subFormRemoveItemButton?: Partial<CButtonProps>
    commonFieldProps?: Partial<GenericInputFieldProps>
  }
  showError?: boolean
  disableTopSpacing?: boolean
  addArrayItemLabel?: string
  useAlwaysArraysInFormData?: boolean
  disableUseFormElement?: boolean
  settings?: {
    gap?: number
    gridWidth?: number | string
  }
  rootInjection?: ReactNode
  useChangeCompleted?: boolean
  disableInitialArrayDivider?: boolean
}
