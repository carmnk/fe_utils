import { BoxProps, FormControlLabelProps } from '@mui/material'
import { ChangeEvent, ReactNode } from 'react'

export type InputTextFieldType =
  | 'text'
  | 'number'
  | 'int'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'autocomplete'
  | 'textarea'
  | 'time'
  | 'json'

/** Def of all input field types */
export type InputFieldType = InputTextFieldType | 'bool' | 'switch' | 'quill'

/**  Def of common props for all boolean input fields (less than textfield) */
export type CommonBooleanInputFieldProps = {
  label?: ReactNode
  name?: string
  required?: boolean
  sx?: BoxProps['sx']
  disabled?: boolean
  helperText?: ReactNode
  disableHelperText?: boolean
  disableLabel?: boolean
  error?: boolean
  color?:
    | 'primary'
    | 'secondary'
    | 'default'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  tooltip?: ReactNode
}

/**  Def of common props for all text input fields */
export type CommonInputFieldProps = CommonBooleanInputFieldProps & {
  placeholder?: string
  maxLength?: number | string
  color?:
    | 'primary'
    | 'secondary'
    // | 'default'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  //   hidden?: boolean
  //   invisible?: boolean
  //   disableHelperTextTheming?: boolean
}

export type GenericInputFieldProps<T extends InputFieldType = InputFieldType> =
  (T extends 'bool' | 'switch'
    ? CommonBooleanInputFieldProps
    : CommonInputFieldProps) &
    (T extends 'bool' | 'switch'
      ? {
          value: boolean
          onChange?: (
            newValue: boolean,
            e?: ChangeEvent<HTMLInputElement>,
            name?: string
          ) => void
          labelPlacement?: FormControlLabelProps['labelPlacement'] // TODO - remove this (should be in specific component props)
        }
      : T extends 'text' | 'textarea' | 'date' | 'time'
        ? {
            value: string
            onChange?: (
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
            injectLabelComponent?: ReactNode
            labelSubtext?: ReactNode
            useNotchedLabel?: boolean
            notchedLabelBgColor?: string
            notchedLabelMarginLeft?: number
          }
        : T extends 'number' | 'int'
          ? {
              value: number | ''
              onChange?: (
                newValue: string,
                e?: ChangeEvent<HTMLInputElement>,
                name?: string
              ) => void
              onChangeCompleted?: (
                newValue: string,
                e?: ChangeEvent<HTMLInputElement>,
                name?: string
              ) => void
              injectLabelComponent?: ReactNode
              labelSubtext?: ReactNode
              useNotchedLabel?: boolean
              notchedLabelBgColor?: string
              notchedLabelMarginLeft?: number
            }
          : T extends 'select' | 'autocomplete'
            ? {
                value: string | ''
                onChange?: (
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
                // injectLabelComponent?: ReactNode
                // labelSubtext?: ReactNode
                useNotchedLabel?: boolean
                notchedLabelBgColor?: string
                notchedLabelMarginLeft?: number
                enableVirtualization?: boolean
              }
            : never)

// export type SpecificComponentProps<T extends InputFieldType> = T extends 'text'
//   ? CTextFieldProps
//   : T extends 'number'
//     ? CNumberFieldProps
//     : T extends 'int'
//       ? CNumberFieldProps
//       : T extends 'date'
//         ? DatePickerProps
//         : T extends 'select'
//           ? CSelectProps
//           : T extends 'multiselect'
//             ? MultiSelectProps
//             : T extends 'autocomplete'
//               ? CAutoCompleteProps
//               : T extends 'textarea'
//                 ? TextAreaProps
//                 : T extends 'bool'
//                   ? CheckboxProps
//                   : never

// export type InputFieldProps<T extends InputFieldType = InputFieldType> =
//   (T extends 'bool' | 'switch'
//     ? CommonBooleanInputFieldProps
//     : CommonInputFieldProps) &
//     GenericInputFieldProps<T> &
//     SpecificComponentProps<T>
// //
