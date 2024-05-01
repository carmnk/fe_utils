export type CommonInputFieldProps = {
  label?: React.ReactNode
  name?: string
  placeholder?: string
  required?: boolean
  maxLength?: number | string
  sx?: any
  disabled?: boolean
  helperText?: string
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
  //   disableHelperTextTheming?: boolean
}
