import { FormControlLabelProps } from '@mui/material'
import { ChangeEvent, ReactNode } from 'react'

export type CommonBooleanInputFieldProps = {
  label?: React.ReactNode
  name?: string
  required?: boolean
  sx?: any
  disabled?: boolean
  helperText?: ReactNode
  disableHelperText?: boolean
  disableLabel?: boolean
  //   hidden?: boolean
  //   invisible?: boolean
  error?: boolean
  color?:
    | 'primary'
    | 'secondary'
    | 'default'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'

  //
  tooltip?: ReactNode
}

export type CommonInputFieldProps = CommonBooleanInputFieldProps & {
  placeholder?: string
  maxLength?: number | string

  //   hidden?: boolean
  //   invisible?: boolean
  //   disableHelperTextTheming?: boolean
}

export type InputFieldType =
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

export type GenericInputFieldProps<T extends InputFieldType = InputFieldType> =
  T extends 'bool' | 'switch'
    ? {
        value: boolean
        onChange: (
          newValue: boolean,
          e?: ChangeEvent<HTMLInputElement>,
          name?: string
        ) => void
        labelPlacement?: FormControlLabelProps['labelPlacement']
      }
    : T extends 'text'
      ? {
          value: string
          onChange: (
            newValue: string,
            e?: ChangeEvent<HTMLInputElement>,
            name?: string
          ) => void
          rows?: number
          onChangeCompleted?: (
            newValue: string,
            e?: ChangeEvent<HTMLInputElement>,
            name?: string
          ) => void
          injectLabelComponent?: React.ReactNode
          labelSubtext?: React.ReactNode
          useNotchedLabel?: boolean
          notchedLabelBgColor?: string
          notchedLabelMarginLeft?: number
        }
      : T extends 'number'
        ? {
            value: number | ''
            onChange: (
              newValue: string,
              e?: ChangeEvent<HTMLInputElement>,
              name?: string
            ) => void
            // rows?: number
            onChangeCompleted?: (
              newValue: string,
              e?: ChangeEvent<HTMLInputElement>,
              name?: string
            ) => void
            injectLabelComponent?: React.ReactNode
            labelSubtext?: React.ReactNode
            useNotchedLabel?: boolean
            notchedLabelBgColor?: string
            notchedLabelMarginLeft?: number
          }
        : T extends 'select' | 'autocomplete'
          ? {
              value: number | ''
              onChange: (
                newValue: string,
                e?: ChangeEvent<HTMLInputElement>,
                name?: string
              ) => void
              // rows?: number
              onChangeCompleted?: (
                newValue: string,
                e?: ChangeEvent<HTMLInputElement>,
                name?: string
              ) => void
              // injectLabelComponent?: React.ReactNode
              // labelSubtext?: React.ReactNode
              useNotchedLabel?: boolean
              notchedLabelBgColor?: string
              notchedLabelMarginLeft?: number
            }
          : never

export type InputFieldProps<T extends InputFieldType = InputFieldType> =
  (T extends 'bool' | 'switch'
    ? CommonBooleanInputFieldProps
    : CommonInputFieldProps) &
    GenericInputFieldProps<T>

// export type GenericInputFieldOption = {
//   label: string
//   value: number | string | boolean
// }

// export type SpecificInputProps<T extends GenericInputFieldType> =
//   T extends 'text'
//     ? TextFieldProps
//     : T extends 'number'
//       ? CNumberFieldProps
//       : T extends 'int'
//         ? CNumberFieldProps
//         : T extends 'date'
//           ? DatePickerProps
//           : T extends 'select'
//             ? CSelectProps
//             : T extends 'multiselect'
//               ? MultiSelectProps
//               : T extends 'autocomplete'
//                 ? CAutoCompleteProps
//                 : T extends 'textarea'
//                   ? TextAreaProps
//                   : T extends 'bool'
//                     ? CheckboxProps
//                     : never

// export type SimpleGenericInputFieldProps<T extends GenericInputFieldType> =
//   CommonInputFieldProps &
//     SpecificInputProps<T> & {
//       type: T
//       value?: T extends 'text' | 'textarea'
//         ? string | null
//         : T extends 'number' | 'int'
//           ? number | '' | null
//           : T extends 'date'
//             ? string | null
//             : T extends 'file'
//               ? number | '' | null
//               : null
//       onChange?: (newValue: any, e?: any) => void
//       hidden?: boolean
//       invisible?: boolean
//       disableHelperTextTheming?: boolean
//       files?: T extends 'file'
//         ? { [key: string]: { file: File; filename: string }[] }
//         : never
//       onFileChange?: (name: string, files: File[]) => void
//     }

// export type GenericInputFieldProps<T extends GenericInputFieldType> =
//   SimpleGenericInputFieldProps<T> & {
//     options?: GenericInputFieldOption[]
//   }
